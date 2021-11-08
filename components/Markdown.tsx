import React from "react"

import ReactMarkdown from "react-markdown"
import type { Components } from "react-markdown/lib/ast-to-react"

import { fromCodeMirror } from "hast-util-from-codemirror"
import { toH } from "hast-to-hyperscript"

import type { LRLanguage } from "@codemirror/language"
import {
	javascriptLanguage,
	jsxLanguage,
	tsxLanguage,
	typescriptLanguage,
} from "@codemirror/lang-javascript"

const languages: Record<string, LRLanguage> = {
	"language-typescript": typescriptLanguage,
	"language-ts": typescriptLanguage,
	"language-tsx": tsxLanguage,
	"language-javascript": javascriptLanguage,
	"language-js": javascriptLanguage,
	"language-jsx": jsxLanguage,
}

const components: Components = {
	code: ({ inline, className, ...props }) => {
		if (inline) {
			return <code>{props.children}</code>
		} else if (className !== undefined && className in languages) {
			const source = String(props.children).replace(/\n+$/, "")
			const { parser } = languages[className]
			const tree = parser.parse(source)
			const root = fromCodeMirror(source, tree)
			const content = toH(React.createElement, root)
			return <code className={className}>{content}</code>
		} else {
			return <code className={className}>{props.children}</code>
		}
	},
	img: ({ src, alt }) => {
		return <img src={src} alt={alt} />
	},
}

export interface MarkdownProps {
	source: string
}

export default function Markdown(props: MarkdownProps) {
	return <ReactMarkdown components={components}>{props.source}</ReactMarkdown>
}
