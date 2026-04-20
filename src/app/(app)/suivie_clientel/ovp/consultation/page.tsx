import { Suspense } from "react"
import OvpModePage from "@/components/suivie-clientel/ovp-mode-page"

export default function OvpConsultationPage() {
  return (
    <Suspense fallback={null}>
      <OvpModePage mode="consultation" />
    </Suspense>
  )
}