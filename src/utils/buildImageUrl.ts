/**
 * Build absolute URL cho ảnh
 * - Nếu ảnh bắt đầu bằng http(s) → giữ nguyên
 * - Nếu ảnh bắt đầu bằng /uploads → prepend ASSET_BASE_URL
 * - Nếu là ảnh static FE (/img/...) → trả nguyên
 */
export const buildImageUrl = (path: string | undefined): string => {
  if (!path) return "";

  if (path.startsWith("http")) return path; // URL tuyệt đối → giữ nguyên
  if (path.startsWith("/uploads")) {
    return `${process.env.ASSET_BASE_URL}${path}`; // ảnh upload từ BE
  }
  return path; // ảnh FE static
};
