import { Suspense } from "react"
import OvpModePage from "@/components/suivie-clientel/ovp-mode-page"

export default function OvpModificationPage() {
  return (
    <Suspense fallback={null}>
      <OvpModePage mode="modification" />
    </Suspense>
  )
}