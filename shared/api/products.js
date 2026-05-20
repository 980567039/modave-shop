import { fetchSiteJson } from "@/shared/api/site";

const objectIdPattern = /^[a-f\d]{24}$/i;

export async function getProductById(id, options = {}) {
  if (!id || !objectIdPattern.test(id)) return null;

  try {
    return await fetchSiteJson(`site/product/get-single?id=${id}`, {
      next: { revalidate: 3600 },
      ...options,
    });
  } catch (error) {
    console.error("Error fetching product:", error);
    return null;
  }
}
