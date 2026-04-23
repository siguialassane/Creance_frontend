import * as React from "react"

import { cn } from "@/lib/utils"

function Input({ className, type, style, ...props }: React.ComponentProps<"input">) {
  return (
    <input
      type={type}
      data-slot="input"
      className={cn(
        "file:text-foreground placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground dark:bg-input/30 flex h-9 w-full min-w-0 rounded-md border px-3 py-1 text-base shadow-xs transition-[color,box-shadow] outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
        // Style par défaut : bordure verte et fond blanc pour les champs saisis
        "border-[#28A325] bg-white",
        // Focus : bordure verte plus foncée avec ring
        "focus-visible:border-[#28A325] focus-visible:ring-[#28A325]/50 focus-visible:ring-[3px]",
        // Erreur : bordure rouge avec ring rouge
        "aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive aria-invalid:bg-red-50",
        className
      )}
      style={{
        borderColor: style?.borderColor || "#28A325",
        backgroundColor: style?.backgroundColor || "#ffffff",
        ...style,
      }}
      {...props}
    />
  )
}

export { Input }
