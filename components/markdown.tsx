"use client"

import ReactMarkdown from "react-markdown"

export function Markdown({ content }) {
  return (
    <div className="prose prose-sm dark:prose-invert max-w-none">
      <ReactMarkdown>{content}</ReactMarkdown>
    </div>
  )
}
