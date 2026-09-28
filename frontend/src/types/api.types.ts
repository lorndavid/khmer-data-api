export interface ApiResponse<T = any> {
  success: boolean;
  data: T;
  meta: {
    request_id?: string;
    timestamp?: string;
    page?: number;
    limit?: number;
    total?: number;
    total_pages?: number;
  };
}

export interface ApiErrorResponse {
  success: false;
  error: {
    code: string;
    message: string;
    details?: any;
  };
  meta: {
    request_id?: string;
    timestamp?: string;
  };
}

export interface PaginationParams {
  page?: number;
  limit?: number;
  search?: string;
  sort?: string;
  order?: 'asc' | 'desc';
  active?: boolean;
}

export interface GeoJsonFeatureCollection {
  type: 'FeatureCollection';
  features: Array<{
    type: 'Feature';
    geometry: {
      type: 'Point';
      coordinates: [number, number]; // [longitude, latitude]
    };
    properties: Record<string, any>;
  }>;
}

export interface SystemHealth {
  status: 'ok' | 'degraded' | 'error';
  service: string;
  version: string;
  database: 'connected' | 'disconnected';
  redis: 'connected' | 'disconnected' | 'disabled';
  timestamp: string;
  uptime_seconds?: number;
}
