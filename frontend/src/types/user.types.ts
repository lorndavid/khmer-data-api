export interface User {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  is_active: boolean;
  role: {
    name: string;
    description: string;
  };
  permissions: string[];
  created_at: string;
}

export interface ApiKey {
  id: string;
  name: string;
  key_prefix: string;
  last_used_at: string | null;
  expires_at: string | null;
  is_active: boolean;
  created_at: string;
}

export interface CreateApiKeyResult extends ApiKey {
  raw_key: string;
}

export interface AuthTokens {
  access_token: string;
  refresh_token: string;
  token_type: string;
  expires_in: number;
}

export interface DeveloperUsageMetrics {
  requests_today: number;
  requests_this_month: number;
  rate_limit_minute: number;
  remaining_limit: number;
  recent_requests: Array<{
    id: string;
    timestamp: string;
    endpoint: string;
    method: string;
    status_code: number;
    duration_ms: number;
    ip: string;
  }>;
}
