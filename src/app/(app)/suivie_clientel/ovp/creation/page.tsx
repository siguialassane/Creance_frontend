import { Suspense } from "react"
import OvpModePage from "@/components/suivie-clientel/ovp-mode-page"

export default function OvpCreationPage() {
  return (
    <Suspense fallback={null}>
      <OvpModePage mode="creation" />
    </Suspense>
  )
}