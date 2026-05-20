export const defaultHomeVariantId = "home-1";

export const homeVariants = {
  "home-1": {
    id: "home-1",
    name: "Home 1",
    dataMode: "site-api",
  },
  "fashion-main": {
    id: "fashion-main",
    name: "Fashion Main",
    dataMode: "static-demo",
  },
  electronic: {
    id: "electronic",
    name: "Electronic",
    dataMode: "static-demo",
  },
  "home-baby": {
    id: "home-baby",
    name: "Home Baby",
    dataMode: "mixed",
  },
};

export function getActiveHomeVariantId(
  variantId =
    process.env.NEXT_PUBLIC_MODAVE_HOME_VARIANT ||
    process.env.NEXT_PUBLIC_HOME_VARIANT ||
    process.env.MODAVE_HOME_VARIANT ||
    defaultHomeVariantId
) {
  return homeVariants[variantId] ? variantId : defaultHomeVariantId;
}

export function getActiveHomeVariant(variantId) {
  return homeVariants[getActiveHomeVariantId(variantId)] || homeVariants[defaultHomeVariantId];
}

export async function getActiveHomeVariantComponent(variantId) {
  const activeVariantId = getActiveHomeVariantId(variantId);

  switch (activeVariantId) {
    case "fashion-main":
      return (await import("./fashion-main/HomeVariant")).default;
    case "electronic":
      return (await import("./electronic/HomeVariant")).default;
    case "home-baby":
      return (await import("./home-baby/HomeVariant")).default;
    case "home-1":
    default:
      return (await import("./home-1/HomeVariant")).default;
  }
}
