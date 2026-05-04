import { Suspense } from "react"
import OvpMensuelPage from "@/components/suivie-clientel/ovp-mensuel-page"

export default function OvpGenerationMensuellePage() {
  return (
    <Suspense fallback={null}>
      <OvpMensuelPage />
    </Suspense>
  )
}