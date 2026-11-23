import { isAxiosError } from "axios";
import apiClient from "@/config/api-client";
import { apiPaths } from "@/constants/api";
import type {
  HimtiKitAppearance,
  StudentValidationResponse,
  KitResource,
  KitSession,
  KitSoftware,
} from "@/types/himti-kit";

// 1. Fetch Tema & Tampilan Website (Background, Overlay, Blur, Accent Color)
export const getAppearance = async (): Promise<HimtiKitAppearance> => {
  const { data } = await apiClient.get<{ success: boolean; data: HimtiKitAppearance }>(
    apiPaths.appearance
  );
  return data.data;
};

// 2. Validasi NIM Mahasiswa di Gate/Login
export const validateNim = async (nim: string): Promise<StudentValidationResponse> => {
  const url = apiPaths.validateNim.replace(":nim", encodeURIComponent(nim.trim()));
  const { data } = await apiClient.get<{ success: boolean; data: StudentValidationResponse }>(url);
  return data.data;
};

// 3. Fetch Modul Catatan Kuliah (Resources)
export const getResources = async (params?: {
  major?: string;
  search?: string;
}): Promise<KitResource[]> => {
  const { data } = await apiClient.get<{ success: boolean; data: KitResource[] }>(
    apiPaths.resources,
    { params }
  );
  return data.data;
};

// 4. Fetch Software Perkuliahan
export const getSoftware = async (params?: { search?: string }): Promise<KitSoftware[]> => {
  const { data } = await apiClient.get<{ success: boolean; data: KitSoftware[] }>(
    apiPaths.software,
    { params }
  );
  return data.data;
};

// 5. Cek session HIMTI Kit (cookie httpOnly dari backend). null = belum login / kedaluwarsa.
export const getSession = async (): Promise<KitSession | null> => {
  try {
    const { data } = await apiClient.get<{ success: boolean; data: KitSession }>(
      apiPaths.session
    );
    return data.data;
  } catch (error) {
    if (isAxiosError(error) && error.response?.status === 401) return null;
    throw error;
  }
};

// 6. Logout: backend menghapus cookie session.
export const logout = async (): Promise<void> => {
  await apiClient.post(apiPaths.logout);
};
