export const SystemRoles = {
  SUPER_ADMIN: 'super_admin',
  ADMIN: 'admin',
  DATA_MANAGER: 'data_manager',
  SUPPORT: 'support',
  VIEWER: 'viewer',
} as const;

export type SystemRole = (typeof SystemRoles)[keyof typeof SystemRoles];

export const SystemPermissions = {
  // Provinces
  PROVINCE_READ: 'province.read',
  PROVINCE_CREATE: 'province.create',
  PROVINCE_UPDATE: 'province.update',
  PROVINCE_DELETE: 'province.delete',

  // Districts
  DISTRICT_READ: 'district.read',
  DISTRICT_CREATE: 'district.create',
  DISTRICT_UPDATE: 'district.update',
  DISTRICT_DELETE: 'district.delete',

  // Communes
  COMMUNE_READ: 'commune.read',
  COMMUNE_CREATE: 'commune.create',
  COMMUNE_UPDATE: 'commune.update',
  COMMUNE_DELETE: 'commune.delete',

  // Villages
  VILLAGE_READ: 'village.read',
  VILLAGE_CREATE: 'village.create',
  VILLAGE_UPDATE: 'village.update',
  VILLAGE_DELETE: 'village.delete',

  // Postal codes
  POSTAL_CODE_READ: 'postal_code.read',
  POSTAL_CODE_CREATE: 'postal_code.create',
  POSTAL_CODE_UPDATE: 'postal_code.update',
  POSTAL_CODE_DELETE: 'postal_code.delete',

  // Data sources
  DATA_SOURCE_READ: 'data_source.read',
  DATA_SOURCE_CREATE: 'data_source.create',
  DATA_SOURCE_UPDATE: 'data_source.update',
  DATA_SOURCE_DELETE: 'data_source.delete',

  // Data imports / exports
  DATA_IMPORT: 'data.import',
  DATA_EXPORT: 'data.export',

  // Users & Roles
  USERS_MANAGE: 'users.manage',
  ROLES_MANAGE: 'roles.manage',

  // API Keys
  API_KEYS_MANAGE: 'api_keys.manage',

  // Audit Logs & System
  AUDIT_LOGS_VIEW: 'audit_logs.view',
  SYSTEM_VIEW: 'system.view',
} as const;

export type SystemPermission = (typeof SystemPermissions)[keyof typeof SystemPermissions];
