import { Suspense } from "react";
import SignUpConfirmation from "./SigjnupConfirmation";

export default function Page() {
  return <Suspense fallback={<div>Loading...</div>}><SignUpConfirmation /></Suspense>
}