import { getActiveHomeVariantComponent } from "@/templates/modave/home-variants/registry";

export default async function ModaveHomePage({ homeData, categories }) {
  const HomeVariant = await getActiveHomeVariantComponent();

  return <HomeVariant homeData={homeData} categories={categories} />;
}
