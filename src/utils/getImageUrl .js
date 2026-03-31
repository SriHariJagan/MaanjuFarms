import { IMAGE_BASE } from "../urls";

export const getImageUrl = (urlOrFile) => {
  if (!urlOrFile) return "";

  // File object
  if (urlOrFile instanceof File) {
    return URL.createObjectURL(urlOrFile);
  }

  // Blob URL (preview)
  if (typeof urlOrFile === "string" && urlOrFile.startsWith("blob:")) {
    return urlOrFile;
  }

  // Full URL
  if (typeof urlOrFile === "string" && urlOrFile.startsWith("http")) {
    return urlOrFile;
  }

  // Local uploads
  return `${IMAGE_BASE}${
    urlOrFile.startsWith("/") ? urlOrFile.slice(1) : urlOrFile
  }`;
};
