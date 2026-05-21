export const defaultHomeVariantId = "home-1";

export const homeVariants = {
  "home-1": {
    id: "home-1",
    name: "Home 1",
    dataMode: "site-api",
  },
};

export function getActiveHomeVariantId() {
  return defaultHomeVariantId;
}

export function getActiveHomeVariant() {
  return homeVariants[defaultHomeVariantId];
}

export async function getActiveHomeVariantComponent() {
  return (await import("./home-1/HomeVariant")).default;
}
