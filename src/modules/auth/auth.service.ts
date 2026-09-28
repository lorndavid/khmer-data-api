import { prisma } from '../../config/database.js';
import {
  hashPassword,
  verifyPassword,
  hashSha256,
  generateRandomToken,
} from '../../common/utils/crypto.js';
import { signAccessToken, signRefreshToken, verifyRefreshToken } from '../../common/utils/jwt.js';
import { UnauthorizedError, ConflictError, NotFoundError } from '../../common/errors/index.js';
import { RegisterInput, LoginInput } from './auth.schema.js';
import { SystemRoles } from '../../common/constants/roles.js';

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
  expiresIn: string;
}

export class AuthService {
  async register(data: RegisterInput): Promise<{ user: unknown; tokens: AuthTokens }> {
    const existing = await prisma.user.findUnique({
      where: { email: data.email.toLowerCase() },
    });

    if (existing) {
      throw new ConflictError('User with this email already exists');
    }

    // Default role for new self-registered users: viewer
    let role = await prisma.role.findUnique({
      where: { name: SystemRoles.VIEWER },
    });

    if (!role) {
      role = await prisma.role.create({
        data: {
          name: SystemRoles.VIEWER,
          description: 'Standard viewer role with basic read access',
          is_system: true,
        },
      });
    }

    const passwordHash = await hashPassword(data.password);

    const user = await prisma.user.create({
      data: {
        email: data.email.toLowerCase(),
        password_hash: passwordHash,
        first_name: data.first_name,
        last_name: data.last_name,
        role_id: role.id,
      },
      include: {
        role: true,
      },
    });

    const tokens = await this.generateTokenPair(user.id, user.email, user.role.id, user.role.name);

    return {
      user: {
        id: user.id,
        email: user.email,
        first_name: user.first_name,
        last_name: user.last_name,
        role: user.role.name,
        created_at: user.created_at,
      },
      tokens,
    };
  }

  async login(data: LoginInput): Promise<{ user: unknown; tokens: AuthTokens }> {
    const user = await prisma.user.findUnique({
      where: { email: data.email.toLowerCase() },
      include: {
        role: true,
      },
    });

    if (!user) {
      throw new UnauthorizedError('Invalid email or password');
    }

    if (!user.is_active) {
      throw new UnauthorizedError('Your account has been deactivated');
    }

    const passwordValid = await verifyPassword(data.password, user.password_hash);
    if (!passwordValid) {
      throw new UnauthorizedError('Invalid email or password');
    }

    const tokens = await this.generateTokenPair(user.id, user.email, user.role.id, user.role.name);

    return {
      user: {
        id: user.id,
        email: user.email,
        first_name: user.first_name,
        last_name: user.last_name,
        role: user.role.name,
        created_at: user.created_at,
      },
      tokens,
    };
  }

  async refreshTokens(refreshToken: string): Promise<AuthTokens> {
    const payload = verifyRefreshToken(refreshToken);
    const tokenHash = hashSha256(refreshToken);

    const tokenRecord = await prisma.refreshToken.findUnique({
      where: { token_hash: tokenHash },
    });

    if (!tokenRecord || tokenRecord.revoked_at || tokenRecord.expires_at < new Date()) {
      throw new UnauthorizedError('Invalid, expired, or revoked refresh token');
    }

    // Revoke old refresh token (Refresh Token Rotation)
    await prisma.refreshToken.update({
      where: { id: tokenRecord.id },
      data: { revoked_at: new Date() },
    });

    const user = await prisma.user.findUnique({
      where: { id: payload.userId },
      include: { role: true },
    });

    if (!user || !user.is_active) {
      throw new UnauthorizedError('User is no longer active');
    }

    return this.generateTokenPair(user.id, user.email, user.role.id, user.role.name);
  }

  async logout(refreshToken: string): Promise<void> {
    const tokenHash = hashSha256(refreshToken);
    await prisma.refreshToken.updateMany({
      where: { token_hash: tokenHash, revoked_at: null },
      data: { revoked_at: new Date() },
    });
  }

  async getMe(userId: string): Promise<unknown> {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        role: {
          include: {
            permissions: {
              include: { permission: true },
            },
          },
        },
      },
    });

    if (!user) {
      throw new NotFoundError('User');
    }

    return {
      id: user.id,
      email: user.email,
      first_name: user.first_name,
      last_name: user.last_name,
      is_active: user.is_active,
      role: {
        id: user.role.id,
        name: user.role.name,
        description: user.role.description,
        permissions: user.role.permissions.map((rp) => rp.permission.code),
      },
      created_at: user.created_at,
      updated_at: user.updated_at,
    };
  }

  private async generateTokenPair(
    userId: string,
    email: string,
    roleId: string,
    roleName: string,
  ): Promise<AuthTokens> {
    const accessToken = signAccessToken({
      userId,
      email,
      roleId,
      roleName,
    });

    const rawRefreshToken = `${generateRandomToken()}.${signRefreshToken({ userId })}`;
    const tokenHash = hashSha256(rawRefreshToken);

    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days

    await prisma.refreshToken.create({
      data: {
        user_id: userId,
        token_hash: tokenHash,
        expires_at: expiresAt,
      },
    });

    return {
      accessToken,
      refreshToken: rawRefreshToken,
      expiresIn: '1h',
    };
  }
}

export const authService = new AuthService();
