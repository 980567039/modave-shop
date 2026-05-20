import { getCategoriesData, getHomePageData } from "@/shared/api/site";
import { ActiveHomePage as HomeTemplate } from "@/templates/pages";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const [homeData, categories] = await Promise.all([
    getHomePageData({ cache: "no-store" }),
    getCategoriesData({ limit: 5 }),
  ]);

  return <HomeTemplate homeData={homeData} categories={categories} />;
}
