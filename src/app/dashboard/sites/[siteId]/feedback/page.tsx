import SiteFeedback from "./sitefeedback";

export default async function SiteFeedbackPage({ params }: { params: Promise<{ siteId: string }> }) {
  const { siteId } = await params;
  return <SiteFeedback params={{ siteId }} />;
}