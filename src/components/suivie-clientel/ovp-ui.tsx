import type { ReactNode } from "react"

type DisplayBoxProps = {
  value: string
  className?: string
  valueClassName?: string
}

type LabeledFieldProps = {
  label: string
  value: string
  className?: string
  labelClassName?: string
  boxClassName?: string
  valueClassName?: string
}

type CodeLabelFieldProps = {
  label: string
  code: string
  libelle: string
  className?: string
  labelClassName?: string
  codeBoxClassName?: string
  libelleBoxClassName?: string
}

type RecapRowProps = {
  label: string
  value: string
}

export function DisplayBox({ value, className, valueClassName }: DisplayBoxProps) {
  return (
    <div
      className={[
        "flex h-9 min-w-0 items-center rounded-[9px] border border-[#9fd89c] bg-white px-2.5 text-[14px] text-slate-800 shadow-sm",
        className || "",
      ].join(" ").trim()}
    >
      <span className={["block min-w-0 truncate", valueClassName || ""].join(" ").trim()}>{value}</span>
    </div>
  )
}

export function LabeledField({
  label,
  value,
  className,
  labelClassName,
  boxClassName,
  valueClassName,
}: LabeledFieldProps) {
  return (
    <div className={["flex min-w-0 items-center gap-2", className || ""].join(" ").trim()}>
      <span className={["shrink-0 text-[14px] font-semibold text-slate-800", labelClassName || "w-32"].join(" ").trim()}>
        {label}
      </span>
      <DisplayBox value={value} className={["flex-1", boxClassName || ""].join(" ").trim()} valueClassName={valueClassName} />
    </div>
  )
}

export function CodeLabelField({
  label,
  code,
  libelle,
  className,
  labelClassName,
  codeBoxClassName,
  libelleBoxClassName,
}: CodeLabelFieldProps) {
  return (
    <div className={["flex min-w-0 items-center gap-2", className || ""].join(" ").trim()}>
      <span className={["shrink-0 text-[14px] font-semibold text-slate-800", labelClassName || "w-32"].join(" ").trim()}>
        {label}
      </span>
      <DisplayBox value={code} className={["w-[96px] flex-none", codeBoxClassName || ""].join(" ").trim()} valueClassName="tabular-nums" />
      <DisplayBox value={libelle} className={["min-w-0 flex-1", libelleBoxClassName || ""].join(" ").trim()} />
    </div>
  )
}

export function RecapRow({ label, value }: RecapRowProps) {
  return (
    <div className="flex items-center gap-2.5">
      <span className="w-[110px] shrink-0 text-[13px] font-medium text-slate-800">{label}</span>
      <DisplayBox value={value} className="h-8 flex-1 rounded-[7px] px-2 text-[13px] shadow-none" valueClassName="tabular-nums" />
    </div>
  )
}

export function formatAmount(value: unknown, options?: { round?: boolean }): string {
  if (value === null || value === undefined || value === "") return "-"
  const numericValue = typeof value === "number" ? value : Number(String(value).replace(/\s/g, ""))
  if (Number.isNaN(numericValue)) return String(value)

  const shouldRound = options?.round !== false
  const displayValue = shouldRound ? Math.round(numericValue) : numericValue

  return new Intl.NumberFormat("fr-FR", {
    minimumFractionDigits: 0,
    maximumFractionDigits: shouldRound ? 0 : 2,
  }).format(displayValue)
}

export function formatDate(value: unknown): string {
  if (!value) return "-"
  const date = new Date(String(value))
  if (Number.isNaN(date.getTime())) return String(value)
  return date.toLocaleDateString("fr-FR")
}

export function formatText(value: unknown): string {
  if (value === null || value === undefined || value === "") return "-"
  return String(value)
}

export function formatCodeAndLabel(code: unknown, label: unknown): string {
  const formattedCode = formatText(code)
  const formattedLabel = formatText(label)

  if (formattedCode === "-" && formattedLabel === "-") return "-"
  if (formattedCode === "-") return formattedLabel
  if (formattedLabel === "-") return formattedCode
  return `${formattedCode} - ${formattedLabel}`
}

export function FieldGroup({ children }: { children: ReactNode }) {
  return <div className="space-y-2.5">{children}</div>
}