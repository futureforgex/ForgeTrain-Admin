import * as React from "react"
import { cn } from "@/lib/utils"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Bold, Italic, List, ListOrdered, Code, Link, Image as ImageIcon, Heading1, Heading2, Heading3, Quote, FileCode, Layout, Table, CheckSquare, Maximize2, Minimize2 } from "lucide-react"
import ReactMarkdown from "react-markdown"

interface MarkdownEditorProps {
  value: string
  onChange: (value: string) => void
  placeholder?: string
  className?: string
  name?: string
  onPaste?: (e: React.ClipboardEvent<HTMLTextAreaElement>) => void
}

const LANGUAGES = [
  { value: 'javascript', label: 'JavaScript' },
  { value: 'typescript', label: 'TypeScript' },
  { value: 'python', label: 'Python' },
  { value: 'java', label: 'Java' },
  { value: 'cpp', label: 'C++' },
  { value: 'csharp', label: 'C#' },
  { value: 'php', label: 'PHP' },
  { value: 'ruby', label: 'Ruby' },
  { value: 'go', label: 'Go' },
  { value: 'rust', label: 'Rust' },
  { value: 'swift', label: 'Swift' },
  { value: 'kotlin', label: 'Kotlin' },
  { value: 'html', label: 'HTML' },
  { value: 'css', label: 'CSS' },
  { value: 'sql', label: 'SQL' },
  { value: 'bash', label: 'Bash' },
  { value: 'plaintext', label: 'Plain Text' },
]

export function MarkdownEditor({
  value,
  onChange,
  placeholder = "Write your content here...",
  className,
  name,
  onPaste,
}: MarkdownEditorProps) {
  const textareaRef = React.useRef<HTMLTextAreaElement>(null)
  const [showCodeDialog, setShowCodeDialog] = React.useState(false)
  const [showCardDialog, setShowCardDialog] = React.useState(false)
  const [selectedLanguage, setSelectedLanguage] = React.useState('javascript')
  const [codeContent, setCodeContent] = React.useState('')
  const [cardTitle, setCardTitle] = React.useState('')
  const [cardContent, setCardContent] = React.useState('')
  const [isFullScreen, setIsFullScreen] = React.useState(false)
  const [paneWidth, setPaneWidth] = React.useState(50) // percent
  const [dragging, setDragging] = React.useState(false)

  // Handle mouse drag for resizing
  const handleMouseDown = (e: React.MouseEvent) => {
    setDragging(true)
    document.body.style.cursor = 'col-resize'
  }
  React.useEffect(() => {
    if (!dragging) return
    const handleMouseMove = (e: MouseEvent) => {
      const editor = document.getElementById('markdown-editor-root')
      if (!editor) return
      const rect = editor.getBoundingClientRect()
      let percent = ((e.clientX - rect.left) / rect.width) * 100
      percent = Math.max(20, Math.min(80, percent))
      setPaneWidth(percent)
    }
    const handleMouseUp = () => {
      setDragging(false)
      document.body.style.cursor = ''
    }
    window.addEventListener('mousemove', handleMouseMove)
    window.addEventListener('mouseup', handleMouseUp)
    return () => {
      window.removeEventListener('mousemove', handleMouseMove)
      window.removeEventListener('mouseup', handleMouseUp)
    }
  }, [dragging])

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
  const insertCodeBlock = () => {
    const codeBlock = `\`\`\`${selectedLanguage}\n${codeContent}\n\`\`\``
    insertText('\n\n' + codeBlock + '\n\n')
    setShowCodeDialog(false)
    setCodeContent('')
  }
  const insertCard = () => {
    const cardBlock = `\n\n::: card ${cardTitle}\n${cardContent}\n:::\n\n`
    insertText(cardBlock)
    setShowCardDialog(false)
    setCardTitle('')
    setCardContent('')
  }

  // Toolbar groups for better UI
  const toolbarGroups = [
    [
      { icon: <Bold className="h-4 w-4" />, action: () => insertText("**", "**"), tooltip: "Bold (Ctrl+B)" },
      { icon: <Italic className="h-4 w-4" />, action: () => insertText("*", "*"), tooltip: "Italic (Ctrl+I)" },
      { icon: <Code className="h-4 w-4" />, action: () => insertText("`", "`"), tooltip: "Inline Code (Ctrl+E)" },
    ],
    [
      { icon: <Heading1 className="h-4 w-4" />, action: () => insertText("# "), tooltip: "Heading 1" },
      { icon: <Heading2 className="h-4 w-4" />, action: () => insertText("## "), tooltip: "Heading 2" },
      { icon: <Heading3 className="h-4 w-4" />, action: () => insertText("### "), tooltip: "Heading 3" },
    ],
    [
      { icon: <List className="h-4 w-4" />, action: () => insertText("- "), tooltip: "Bullet List" },
      { icon: <ListOrdered className="h-4 w-4" />, action: () => insertText("1. "), tooltip: "Numbered List" },
      { icon: <CheckSquare className="h-4 w-4" />, action: () => insertText("- [ ] "), tooltip: "Task List" },
    ],
    [
      { icon: <FileCode className="h-4 w-4" />, action: () => setShowCodeDialog(true), tooltip: "Code Block" },
      { icon: <Layout className="h-4 w-4" />, action: () => setShowCardDialog(true), tooltip: "Insert Card" },
      { icon: <Quote className="h-4 w-4" />, action: () => insertText("> "), tooltip: "Quote" },
      { icon: <Table className="h-4 w-4" />, action: () => insertText("\n| Header 1 | Header 2 |\n|----------|----------|\n| Cell 1   | Cell 2   |\n"), tooltip: "Insert Table" },
    ],
    [
      { icon: <Link className="h-4 w-4" />, action: () => { const url = prompt("Enter URL:"); if (url) insertText("[", `](${url})`) }, tooltip: "Insert Link" },
      { icon: <ImageIcon className="h-4 w-4" />, action: () => { const url = prompt("Enter image URL:"); if (url) insertText("![", `](${url})`) }, tooltip: "Insert Image" },
    ],
  ]

  return (
    <div id="markdown-editor-root" className={cn("relative flex flex-col border rounded-lg bg-white shadow-lg", className, isFullScreen ? "fixed inset-0 z-50 p-8 bg-white" : "")}
      style={isFullScreen ? { height: '100vh', width: '100vw' } : {}}>
      {/* Toolbar */}
      <div className="flex items-center gap-2 p-2 border-b bg-gray-50 sticky top-0 z-10">
        {toolbarGroups.map((group, i) => (
          <div key={i} className="flex items-center gap-1">
            {group.map((item, j) => (
              <Button
                key={j}
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
            {i < toolbarGroups.length - 1 && <div className="w-px h-6 bg-gray-200 mx-2" />}
          </div>
        ))}
        <div className="flex-1" />
        <Button
          variant="ghost"
          size="sm"
          className="h-8 w-8 p-0"
          onClick={() => setIsFullScreen(f => !f)}
          title={isFullScreen ? "Exit Full Screen" : "Full Screen"}
        >
          {isFullScreen ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
        </Button>
      </div>

      {/* Resizable Split Pane */}
      <div className="flex flex-1 min-h-[300px] relative" style={{ background: '#fafbfc' }}>
        {/* Editor */}
        <div
          className={cn("h-full flex flex-col border-r bg-white transition-shadow", dragging ? "shadow-lg" : "")}
          style={{ width: `${paneWidth}%` }}
        >
          <Textarea
            ref={textareaRef}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder}
            className="min-h-[300px] font-mono border-0 rounded-none resize-none focus-visible:ring-2 focus-visible:ring-indigo-300 bg-white text-gray-900 p-4 text-base"
            spellCheck={true}
            autoCorrect="on"
            autoCapitalize="sentences"
            style={{ background: 'inherit' }}
            name={name}
            onPaste={onPaste}
          />
        </div>
        {/* Draggable Divider */}
        <div
          className="w-2 cursor-col-resize bg-gray-100 hover:bg-indigo-200 transition-colors z-20"
          style={{ marginLeft: -1, marginRight: -1 }}
          onMouseDown={handleMouseDown}
        >
          <div className="h-full w-1 mx-auto bg-indigo-300 rounded" style={{ opacity: dragging ? 1 : 0.3 }} />
        </div>
        {/* Preview */}
        <div
          className="flex-1 p-6 overflow-auto prose prose-sm max-w-none bg-gray-50 border-l"
          style={{ width: `${100 - paneWidth}%` }}
        >
          {value.trim() ? (
            <ReactMarkdown
              components={{
                code(props) {
                  const { node, className, children, ...rest } = props;
                  // @ts-ignore: inline is present at runtime
                  const inline = (props as any).inline;
                  const match = /language-(\w+)/.exec(className || '')
                  return !inline && match ? (
                    <pre className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto text-sm">
                      <code className={`language-${match[1]}`} {...rest}>
                        {String(children).replace(/\n$/, '')}
                      </code>
                    </pre>
                  ) : (
                    <code className="bg-gray-100 px-1 py-0.5 rounded text-sm" {...rest}>
                      {children}
                    </code>
                  )
                },
                input({ checked, ...props }) {
                  // Render checkboxes for task lists
                  return <input type="checkbox" checked={checked} readOnly className="mr-1 align-middle" />
                },
                div({ node, className, children, ...props }) {
                  // Custom card block
                  if (className?.includes('card')) {
                    const title = className.split(' ')[1] || ''
                    return (
                      <div className="border rounded-lg p-4 my-4 bg-indigo-50 shadow-sm">
                        {title && <div className="font-semibold mb-2 text-indigo-700">{title}</div>}
                        {children}
                      </div>
                    )
                  }
                  return <div className={className} {...props}>{children}</div>
                }
              }}
            >
              {value}
            </ReactMarkdown>
          ) : (
            <div className="flex flex-col items-center justify-center h-full text-gray-400 italic select-none">
              <span className="text-2xl mb-2">📝</span>
              <span>Start writing your lesson in markdown...</span>
              <span className="text-xs mt-2">Tip: Use the toolbar above or type markdown directly!</span>
            </div>
          )}
        </div>
      </div>

      {/* Code Block Dialog */}
      {showCodeDialog && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl">
            <h3 className="text-lg font-semibold mb-4">Insert Code Block</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Language</label>
                <select
                  value={selectedLanguage}
                  onChange={(e) => setSelectedLanguage(e.target.value)}
                  className="w-full p-2 border rounded"
                >
                  {LANGUAGES.map(lang => (
                    <option key={lang.value} value={lang.value}>{lang.label}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Code</label>
                <textarea
                  value={codeContent}
                  onChange={(e) => setCodeContent(e.target.value)}
                  className="w-full h-48 p-2 border rounded font-mono"
                  placeholder="Enter your code here..."
                />
              </div>
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setShowCodeDialog(false)}>Cancel</Button>
                <Button onClick={insertCodeBlock}>Insert</Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Card Dialog */}
      {showCardDialog && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl">
            <h3 className="text-lg font-semibold mb-4">Insert Card</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Card Title</label>
                <input
                  type="text"
                  value={cardTitle}
                  onChange={(e) => setCardTitle(e.target.value)}
                  className="w-full p-2 border rounded"
                  placeholder="Enter card title..."
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Card Content</label>
                <textarea
                  value={cardContent}
                  onChange={(e) => setCardContent(e.target.value)}
                  className="w-full h-48 p-2 border rounded"
                  placeholder="Enter card content (markdown supported)..."
                />
              </div>
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setShowCardDialog(false)}>Cancel</Button>
                <Button onClick={insertCard}>Insert</Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
} 