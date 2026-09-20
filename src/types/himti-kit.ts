export interface HimtiKitAppearance {
  accentColor: string;
  backgroundImageUrl: string;
  overlayEnabled: boolean;
  overlayDarkness: number; // Nilai 0 - 100 (%)
  blurEnabled: boolean;
  blurIntensity: number; // Nilai 0 - 24 (px)
  updatedAt?: string;
}

export interface StudentValidationResponse {
  eligible: boolean;
  name?: string;
}

export interface KitResource {
  id: string;
  title: string;
  description?: string;
  major: string;
  downloadUrl: string;
  coverImageUrl?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface KitSoftware {
  id: string;
  name: string;
  description: string;
  downloadUrl: string;
  coverImageUrl?: string | null;
  createdAt: string;
  updatedAt: string;
}