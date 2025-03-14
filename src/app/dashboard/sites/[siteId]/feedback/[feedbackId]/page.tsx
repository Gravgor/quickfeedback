import FeedbackDetail from "./feedbackdetail";
export default async function FeedbackDetailPage({ params }: { params: Promise<{ siteId: string, feedbackId: string }> }) {
  const { siteId, feedbackId } = await params;
  return <FeedbackDetail params={{ siteId, feedbackId }} />;
} 