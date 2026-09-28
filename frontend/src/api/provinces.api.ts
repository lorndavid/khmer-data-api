import { apiClient } from './client';
import type { ApiResponse, PaginationParams, GeoJsonFeatureCollection } from '../types/api.types';
import type {
  Province,
  District,
  Commune,
  Village,
  PostalCode,
  LocationHierarchy,
  StatisticsData,
  DataSource,
} from '../types/location.types';

export const provincesApi = {
  async getProvinces(params?: PaginationParams) {
    const res = await apiClient.get<ApiResponse<Province[]>>('/provinces', { params });
    return res.data;
  },

  async getProvince(codeOrSlug: string) {
    const res = await apiClient.get<ApiResponse<Province>>(`/provinces/${codeOrSlug}`);
    return res.data;
  },

  async getProvinceDistricts(codeOrSlug: string) {
    const res = await apiClient.get<ApiResponse<District[]>>(`/provinces/${codeOrSlug}/districts`);
    return res.data;
  },

  async getDistricts(params?: PaginationParams & { province_code?: string }) {
    const res = await apiClient.get<ApiResponse<District[]>>('/districts', { params });
    return res.data;
  },

  async getDistrict(codeOrSlug: string) {
    const res = await apiClient.get<ApiResponse<District>>(`/districts/${codeOrSlug}`);
    return res.data;
  },

  async getDistrictCommunes(codeOrSlug: string) {
    const res = await apiClient.get<ApiResponse<Commune[]>>(`/districts/${codeOrSlug}/communes`);
    return res.data;
  },

  async getCommunes(params?: PaginationParams & { district_code?: string }) {
    const res = await apiClient.get<ApiResponse<Commune[]>>('/communes', { params });
    return res.data;
  },

  async getCommune(codeOrSlug: string) {
    const res = await apiClient.get<ApiResponse<Commune>>(`/communes/${codeOrSlug}`);
    return res.data;
  },

  async getCommuneVillages(codeOrSlug: string) {
    const res = await apiClient.get<ApiResponse<Village[]>>(`/communes/${codeOrSlug}/villages`);
    return res.data;
  },

  async getVillages(params?: PaginationParams & { commune_code?: string }) {
    const res = await apiClient.get<ApiResponse<Village[]>>('/villages', { params });
    return res.data;
  },

  async getVillage(codeOrSlug: string) {
    const res = await apiClient.get<ApiResponse<Village>>(`/villages/${codeOrSlug}`);
    return res.data;
  },

  async getPostalCodes(params?: PaginationParams & { postal_code?: string; province_code?: string }) {
    const res = await apiClient.get<ApiResponse<PostalCode[]>>('/postal-codes', { params });
    return res.data;
  },

  async getPostalCode(code: string) {
    const res = await apiClient.get<ApiResponse<PostalCode>>(`/postal-codes/${code}`);
    return res.data;
  },

  async getLocationHierarchy(code: string) {
    const res = await apiClient.get<ApiResponse<LocationHierarchy>>(`/locations/${code}`);
    return res.data;
  },

  async getGeoProvinces() {
    const res = await apiClient.get<ApiResponse<GeoJsonFeatureCollection>>('/geo/provinces');
    return res.data;
  },

  async getGeoDistricts() {
    const res = await apiClient.get<ApiResponse<GeoJsonFeatureCollection>>('/geo/districts');
    return res.data;
  },

  async getStatistics() {
    const res = await apiClient.get<ApiResponse<StatisticsData>>('/statistics');
    return res.data;
  },

  async getDataSources() {
    const res = await apiClient.get<ApiResponse<DataSource[]>>('/data-sources');
    return res.data;
  },
};
