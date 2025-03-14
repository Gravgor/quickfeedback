import SiteOnboardingDetailPage from "./siteonboarding";

export default async function SiteOnboardingPage({ params }: { params: Promise<{ siteId: string }> }) {
  const { siteId } = await params;
  return <SiteOnboardingDetailPage params={{ siteId }} />;
} 