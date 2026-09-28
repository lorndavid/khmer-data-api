export interface Province {
  id: string;
  code: string;
  name_km: string;
  name_en: string;
  slug: string;
  type: string;
  latitude: number | null;
  longitude: number | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface District {
  id: string;
  code: string;
  province_id: string;
  province_code?: string;
  province_name_en?: string;
  name_km: string;
  name_en: string;
  slug: string;
  type: string;
  latitude: number | null;
  longitude: number | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface Commune {
  id: string;
  code: string;
  district_id: string;
  district_code?: string;
  district_name_en?: string;
  name_km: string;
  name_en: string;
  slug: string;
  type: string;
  latitude: number | null;
  longitude: number | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface Village {
  id: string;
  code: string;
  commune_id: string;
  commune_code?: string;
  commune_name_en?: string;
  name_km: string;
  name_en: string;
  slug: string;
  latitude: number | null;
  longitude: number | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface PostalCode {
  id: string;
  postal_code: string;
  province_id: string | null;
  district_id: string | null;
  commune_id: string | null;
  is_active: boolean;
  province?: {
    code: string;
    name_km: string;
    name_en: string;
  } | null;
  district?: {
    code: string;
    name_km: string;
    name_en: string;
  } | null;
  commune?: {
    code: string;
    name_km: string;
    name_en: string;
  } | null;
  created_at: string;
  updated_at: string;
}

export interface LocationHierarchy {
  province: Province | null;
  district: District | null;
  commune: Commune | null;
  village: Village | null;
  postal_codes: PostalCode[];
}

export interface SearchResultItem {
  type: 'province' | 'district' | 'commune' | 'village' | 'postal_code';
  code: string;
  name_km: string;
  name_en: string;
  slug?: string;
  parent?: string;
  score?: number;
}

export interface StatisticsData {
  province_count: number;
  district_count: number;
  commune_count: number;
  village_count: number;
  postal_code_count: number;
  last_data_update: string;
}

export interface DataSource {
  id: string;
  name: string;
  organization: string;
  url: string;
  license: string;
  description: string;
  last_verified_at: string;
}
