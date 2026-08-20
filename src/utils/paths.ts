/**
 * 资源路径助手：兼容任意部署根路径
 * - 本地 / Cloudflare Pages（根路径）：asset("/images/x") → "/images/x"
 * - GitHub Pages（子路径 /repo/）：自动变为 "/repo/images/x"
 * 全站图片路径一律经此函数，避免部署后 404。
 */
export const asset = (p: string): string =>
  `${import.meta.env.BASE_URL}${p.replace(/^\//, "")}`;
