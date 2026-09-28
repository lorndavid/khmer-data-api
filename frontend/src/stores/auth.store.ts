import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import type { User, AuthTokens } from '../types/user.types';
import { authApi, type LoginPayload, type RegisterPayload } from '../api/auth.api';

function getInitialUser(): User | null {
  try {
    const saved = localStorage.getItem('khmerapi_user');
    return saved ? JSON.parse(saved) : null;
  } catch {
    return null;
  }
}

export const useAuthStore = defineStore('auth', () => {
  const user = ref<User | null>(getInitialUser());
  const accessToken = ref<string | null>(localStorage.getItem('khmerapi_access_token'));
  const refreshToken = ref<string | null>(localStorage.getItem('khmerapi_refresh_token'));
  const isLoading = ref<boolean>(false);
  const authError = ref<string | null>(null);

  const isAuthenticated = computed(() => !!accessToken.value && !!user.value);
  const fullName = computed(() => {
    if (!user.value) return '';
    return `${user.value.first_name} ${user.value.last_name}`.trim();
  });

  function setSession(userData: User, tokens: AuthTokens) {
    user.value = userData;
    accessToken.value = tokens.access_token;
    refreshToken.value = tokens.refresh_token;

    localStorage.setItem('khmerapi_user', JSON.stringify(userData));
    localStorage.setItem('khmerapi_access_token', tokens.access_token);
    localStorage.setItem('khmerapi_refresh_token', tokens.refresh_token);
  }

  function clearSession() {
    user.value = null;
    accessToken.value = null;
    refreshToken.value = null;

    localStorage.removeItem('khmerapi_user');
    localStorage.removeItem('khmerapi_access_token');
    localStorage.removeItem('khmerapi_refresh_token');
  }

  async function login(payload: LoginPayload) {
    isLoading.value = true;
    authError.value = null;
    try {
      const res = await authApi.login(payload);
      if (res.success && res.data) {
        setSession(res.data.user, res.data.tokens);
        return { success: true };
      }
      throw new Error('Invalid login response');
    } catch (err: any) {
      const msg = err.response?.data?.error?.message || err.message || 'Login failed';
      authError.value = msg;
      return { success: false, error: msg };
    } finally {
      isLoading.value = false;
    }
  }

  async function register(payload: RegisterPayload) {
    isLoading.value = true;
    authError.value = null;
    try {
      const res = await authApi.register(payload);
      if (res.success && res.data) {
        setSession(res.data.user, res.data.tokens);
        return { success: true };
      }
      throw new Error('Registration failed');
    } catch (err: any) {
      const msg = err.response?.data?.error?.message || err.message || 'Registration failed';
      authError.value = msg;
      return { success: false, error: msg };
    } finally {
      isLoading.value = false;
    }
  }

  async function fetchMe() {
    if (!accessToken.value) return;
    try {
      const res = await authApi.me();
      if (res.success && res.data) {
        user.value = res.data;
        localStorage.setItem('khmerapi_user', JSON.stringify(res.data));
      }
    } catch (_err) {
      clearSession();
    }
  }

  async function logout() {
    try {
      if (refreshToken.value) {
        await authApi.logout(refreshToken.value);
      }
    } catch (_err) {
      // Ignore network errors on logout
    } finally {
      clearSession();
    }
  }

  return {
    user,
    accessToken,
    refreshToken,
    isLoading,
    authError,
    isAuthenticated,
    fullName,
    login,
    register,
    fetchMe,
    logout,
  };
});
