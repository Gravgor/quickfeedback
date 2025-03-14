import SiteDetail from "./sidedetail";
export default async function SiteDetailPage({ params }: { params: Promise<{ siteId: string }> }) {
  const { siteId } = await params;
  return <SiteDetail params={{ siteId }} />;
}
