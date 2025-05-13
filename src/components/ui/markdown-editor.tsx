import * as React from "react"
import { cn } from "@/lib/utils"
import { Textarea } from "@/components/ui/textarea"

interface MarkdownEditorProps {
  value: string
  onChange: (value: string) => void
  placeholder?: string
  className?: string
}

export function MarkdownEditor({
  value,
  onChange,
  placeholder = "Write your content here...",
  className,
}: MarkdownEditorProps) {
  return (
    <div className={cn("relative", className)}>
      <Textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="min-h-[200px] font-mono"
      />
      <div className="absolute bottom-2 right-2 text-xs text-muted-foreground">
        Markdown supported
      </div>
    </div>
  )
} 