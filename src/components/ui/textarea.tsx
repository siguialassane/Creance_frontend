import * as React from "react"
import { cn } from "@/lib/utils"

export interface TextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {}

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, style, ...props }, ref) => {
    return (
      <textarea
        className={cn(
          "flex min-h-[80px] w-full rounded-md border px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
          // Style par défaut : bordure verte et fond gris clair
          "border-[#28A325] bg-[#f3f4f6]",
          // Focus : bordure verte plus foncée avec ring
          "focus-visible:border-[#28A325] focus-visible:ring-[#28A325]/50",
          className
        )}
        style={{
          borderColor: style?.borderColor || "#28A325",
          backgroundColor: style?.backgroundColor || "#f3f4f6",
          ...style,
        }}
        ref={ref}
        {...props}
      />
    )
  }
)
Textarea.displayName = "Textarea"

export { Textarea }


