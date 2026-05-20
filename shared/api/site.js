import { headers } from "next/headers";

const jsonHeaders = {
  "Content-Type": "application/json",
};

async function getRequestOrigin() {
  try {
    const requestHeaders = await headers();
    const host =
      requestHeaders.get("x-forwarded-host") || requestHeaders.get("host");

    if (!host) {
      return null;
    }

    const protocol =
      requestHeaders.get("x-forwarded-proto") ||
      (host.startsWith("localhost") || host.startsWith("127.0.0.1")
        ? "http"
        : "https");

    return `${protocol}://${host}`;
  } catch {
    return null;
  }
}

async function getApiContext() {
  const requestOrigin = await getRequestOrigin();
  const baseUrl = requestOrigin
    ? `${requestOrigin}/api`
    : process.env.NEXT_PUBLIC_API_URL;

  if (!baseUrl) {
    throw new Error("NEXT_PUBLIC_API_URL is not configured");
  }

  return {
    baseUrl,
    origin: requestOrigin || process.env.NEXTAUTH_URL || "",
  };
}

export async function fetchSiteJson(path, options = {}) {
  const { baseUrl, origin } = await getApiContext();
  const internalRequestSecret = process.env.INTERNAL_REQUEST_SECRET;
  const res = await fetch(`${baseUrl}/${path.replace(/^\/+/, "")}`, {
    method: "GET",
    headers: {
      ...jsonHeaders,
      origin,
      ...(internalRequestSecret
        ? { "x-internal-request": internalRequestSecret }
        : {}),
    },
    ...options,
  });

  if (!res.ok) {
    const body = await res.text();
    throw new Error(`Failed to fetch ${path}: ${res.status} ${body}`);
  }

  const { data } = await res.json();
  return data;
}

export async function getHomePageData(options = {}) {
  try {
    return await fetchSiteJson("site/home", options);
  } catch (error) {
    console.error("Error fetching home data:", error);
    return null;
  }
}

export async function getCategoriesData({ limit, ...options } = {}) {
  try {
    const data = await fetchSiteJson("site/categories", {
      next: { revalidate: 3600 },
      ...options,
    });

    return typeof limit === "number" ? data.slice(0, limit) : data;
  } catch (error) {
    console.error("Error fetching categories:", error);
    return [];
  }
}
