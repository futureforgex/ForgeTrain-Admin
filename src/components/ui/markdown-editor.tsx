import * as React from "react"
import { cn } from "@/lib/utils"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { 
  Bold, 
  Italic, 
  List, 
  ListOrdered, 
  Code, 
  Link, 
  Image as ImageIcon, 
  Heading1, 
  Heading2, 
  Heading3, 
  Table, 
  FileCode,
  Quote,
  CheckSquare,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Strikethrough,
  Underline,
  Highlighter,
  SeparatorHorizontal,
  Subscript,
  Superscript
} from "lucide-react"
import ReactMarkdown from "react-markdown"
import { Label } from "@/components/ui/label"

interface MarkdownEditorProps {
  value: string
  onChange: (value: string) => void
  placeholder?: string
  className?: string
  name?: string
  onPaste?: (e: React.ClipboardEvent<HTMLTextAreaElement>) => void
}

export function MarkdownEditor({
  value,
  onChange,
  placeholder = "Write your content here...",
  className,
  name,
  onPaste,
}: MarkdownEditorProps) {
  const textareaRef = React.useRef<HTMLTextAreaElement>(null)
  const [showPreview, setShowPreview] = React.useState(false)

  const insertText = (before: string, after: string = "") => {
    const textarea = textareaRef.current
    if (!textarea) return
    const start = textarea.selectionStart
    const end = textarea.selectionEnd
    const text = value
    const beforeText = text.substring(0, start)
    const selectedText = text.substring(start, end)
    const afterText = text.substring(end)
    const newText = beforeText + before + selectedText + after + afterText
    onChange(newText)
    setTimeout(() => {
      textarea.focus()
      textarea.setSelectionRange(
        start + before.length,
        end + before.length
      )
    }, 0)
  }

  const handlePaste = (e: React.ClipboardEvent<HTMLTextAreaElement>) => {
    if (onPaste) {
      onPaste(e)
      return
    }

    // Handle ChatGPT-style formatting
    const text = e.clipboardData.getData('text/plain')
    if (text) {
      e.preventDefault()
      
      // Get cursor position
      const textarea = textareaRef.current
      if (!textarea) return
      const start = textarea.selectionStart
      const end = textarea.selectionEnd
      
      // Process the pasted text
      let formattedText = text
        // Handle code blocks with language
        .replace(/```(\w*)\n([\s\S]*?)```/g, (match, lang, code) => {
          return `\`\`\`${lang}\n${code.trim()}\n\`\`\``
        })
        // Handle code blocks without language
        .replace(/```\n([\s\S]*?)```/g, (match, code) => {
          return `\`\`\`\n${code.trim()}\n\`\`\``
        })
        // Handle inline code
        .replace(/`([^`]+)`/g, '`$1`')
        // Handle bullet lists
        .replace(/^[-*]\s+(.+)$/gm, '- $1')
        // Handle numbered lists
        .replace(/^\d+\.\s+(.+)$/gm, '1. $1')
        // Handle headers
        .replace(/^(#{1,6})\s+(.+)$/gm, '$1 $2')
        // Handle bold
        .replace(/\*\*(.+?)\*\*/g, '**$1**')
        // Handle italic
        .replace(/\*(.+?)\*/g, '*$1*')
        // Handle blockquotes
        .replace(/^>\s+(.+)$/gm, '> $1')
        // Handle horizontal rules
        .replace(/^[-*_]{3,}$/gm, '---')
        // Handle line breaks
        .replace(/\n/g, '\n')
        // Handle multiple spaces
        .replace(/ {2,}/g, ' ')

      // Insert the formatted text
      const newText = value.substring(0, start) + formattedText + value.substring(end)
      onChange(newText)

      // Set cursor position after the pasted text
      setTimeout(() => {
        textarea.focus()
        const newCursorPos = start + formattedText.length
        textarea.setSelectionRange(newCursorPos, newCursorPos)
      }, 0)
    }
  }

  const insertTable = () => {
    const tableTemplate = `| Header 1 | Header 2 | Header 3 |
|----------|----------|----------|
| Cell 1   | Cell 2   | Cell 3   |
| Cell 4   | Cell 5   | Cell 6   |`
    insertText(tableTemplate)
  }

  const insertCodeBlock = () => {
    const codeBlockTemplate = "```\n// Your code here\n```"
    insertText(codeBlockTemplate)
  }

  const insertBulletList = () => {
    const textarea = textareaRef.current
    if (!textarea) return
    const start = textarea.selectionStart
    const end = textarea.selectionEnd
    const text = value
    const beforeText = text.substring(0, start)
    const selectedText = text.substring(start, end)
    const afterText = text.substring(end)
    
    // Convert selected text into bullet points
    const bulletedText = selectedText
      .split('\n')
      .map(line => line.trim() ? `- ${line}` : '')
      .join('\n')
    
    const newText = beforeText + bulletedText + afterText
    onChange(newText)
  }

  const insertChecklist = () => {
    const textarea = textareaRef.current
    if (!textarea) return
    const start = textarea.selectionStart
    const end = textarea.selectionEnd
    const text = value
    const beforeText = text.substring(0, start)
    const selectedText = text.substring(start, end)
    const afterText = text.substring(end)
    
    // Convert selected text into checklist items
    const checklistText = selectedText
      .split('\n')
      .map(line => line.trim() ? `- [ ] ${line}` : '')
      .join('\n')
    
    const newText = beforeText + checklistText + afterText
    onChange(newText)
  }

  const insertBlockquote = () => {
    const textarea = textareaRef.current
    if (!textarea) return
    const start = textarea.selectionStart
    const end = textarea.selectionEnd
    const text = value
    const beforeText = text.substring(0, start)
    const selectedText = text.substring(start, end)
    const afterText = text.substring(end)
    
    // Convert selected text into blockquote
    const blockquoteText = selectedText
      .split('\n')
      .map(line => line.trim() ? `> ${line}` : '')
      .join('\n')
    
    const newText = beforeText + blockquoteText + afterText
    onChange(newText)
  }

  const toolbar = [
    { icon: <Bold className="h-4 w-4" />, action: () => insertText("**", "**"), tooltip: "Bold" },
    { icon: <Italic className="h-4 w-4" />, action: () => insertText("*", "*"), tooltip: "Italic" },
    { icon: <Underline className="h-4 w-4" />, action: () => insertText("__", "__"), tooltip: "Underline" },
    { icon: <Strikethrough className="h-4 w-4" />, action: () => insertText("~~", "~~"), tooltip: "Strikethrough" },
    { icon: <Highlighter className="h-4 w-4" />, action: () => insertText("==", "=="), tooltip: "Highlight" },
    { icon: <Subscript className="h-4 w-4" />, action: () => insertText("<sub>", "</sub>"), tooltip: "Subscript" },
    { icon: <Superscript className="h-4 w-4" />, action: () => insertText("<sup>", "</sup>"), tooltip: "Superscript" },
    { icon: <Code className="h-4 w-4" />, action: () => insertText("`", "`"), tooltip: "Inline Code" },
    { icon: <FileCode className="h-4 w-4" />, action: insertCodeBlock, tooltip: "Code Block" },
    { icon: <Heading1 className="h-4 w-4" />, action: () => insertText("# "), tooltip: "Heading 1" },
    { icon: <Heading2 className="h-4 w-4" />, action: () => insertText("## "), tooltip: "Heading 2" },
    { icon: <Heading3 className="h-4 w-4" />, action: () => insertText("### "), tooltip: "Heading 3" },
    { icon: <List className="h-4 w-4" />, action: insertBulletList, tooltip: "Bullet List" },
    { icon: <ListOrdered className="h-4 w-4" />, action: () => insertText("1. "), tooltip: "Numbered List" },
    { icon: <CheckSquare className="h-4 w-4" />, action: insertChecklist, tooltip: "Checklist" },
    { icon: <Quote className="h-4 w-4" />, action: insertBlockquote, tooltip: "Blockquote" },
    { icon: <Table className="h-4 w-4" />, action: insertTable, tooltip: "Insert Table" },
    { icon: <SeparatorHorizontal className="h-4 w-4" />, action: () => insertText("\n---\n"), tooltip: "Horizontal Rule" },
    { icon: <Link className="h-4 w-4" />, action: () => { const url = prompt("Enter URL:"); if (url) insertText("[", `](${url})`) }, tooltip: "Insert Link" },
    { icon: <ImageIcon className="h-4 w-4" />, action: () => { const url = prompt("Enter image URL:"); if (url) insertText("![", `](${url})`) }, tooltip: "Insert Image" },
  ]

  return (
    <div className={cn("border rounded-lg bg-white shadow", className)}>
      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-1 p-2 border-b bg-gray-50">
        {toolbar.map((item, i) => (
          <Button
            key={i}
            variant="ghost"
            size="sm"
            className="h-8 w-8 p-0"
            onClick={item.action}
            title={item.tooltip}
            tabIndex={0}
          >
            {item.icon}
          </Button>
        ))}
        <div className="flex-1" />
        <Button
          variant={showPreview ? "default" : "outline"}
          size="sm"
          className="h-8 px-3"
          onClick={() => setShowPreview(p => !p)}
        >
          {showPreview ? "Edit" : "Preview"}
        </Button>
      </div>
      {/* Editor or Preview */}
      {showPreview ? (
        <div className="p-4 min-h-[120px] prose prose-sm max-w-none bg-gray-50">
          <ReactMarkdown>{value}</ReactMarkdown>
        </div>
      ) : (
        <Textarea
          ref={textareaRef}
          value={value}
          onChange={e => onChange(e.target.value)}
          onPaste={handlePaste}
          placeholder={placeholder}
          className="min-h-[120px] font-mono border-0 rounded-none resize-none focus-visible:ring-2 focus-visible:ring-indigo-300 bg-white text-gray-900 p-4 text-base"
          spellCheck={true}
          autoCorrect="on"
          autoCapitalize="sentences"
          name={name}
        />
      )}
    </div>
  )
} 