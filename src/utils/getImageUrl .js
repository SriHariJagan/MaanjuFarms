import { IMAGE_URL } from "../urls";

/**
 * Get full image URL for displaying
 * @param {string|File} urlOrFile - Either a full URL, relative path, or File object
 * @returns {string} - Full URL suitable for img src
 */
export const getImageUrl = (urlOrFile) => {
  if (!urlOrFile) return "";

  // If it's a File object (local upload), create object URL
  if (urlOrFile instanceof File) return URL.createObjectURL(urlOrFile);

  // If URL starts with http, return as is
  if (urlOrFile.startsWith("http")) return urlOrFile;

  // Otherwise prepend IMAGE_URL
  return `${IMAGE_URL}${urlOrFile.startsWith("/") ? urlOrFile.slice(1) : urlOrFile}`;
};
