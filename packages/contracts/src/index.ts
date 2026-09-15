export * from "./job-state.js";

export const SUPPORTED_MVP_IMAGE_FORMATS = ["image/jpeg", "image/png", "image/webp"] as const;
export type SupportedMvpImageFormat = (typeof SUPPORTED_MVP_IMAGE_FORMATS)[number];

export const ASSET_KINDS = ["SOURCE", "MASK", "RESULT", "THUMBNAIL", "PREVIEW"] as const;
export type AssetKind = (typeof ASSET_KINDS)[number];

export const UPLOAD_PURPOSES = ["SOURCE", "MASK"] as const;
export type UploadPurpose = (typeof UPLOAD_PURPOSES)[number];

export const MASK_CONTRACT = {
  format: "image/png",
  bitDepth: 8,
  channels: 1,
  preserveValue: 0,
  removeValue: 255,
  coordinateSpaceVersion: 1,
} as const;
