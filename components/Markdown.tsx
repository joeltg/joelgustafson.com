import React from "react"

import ReactMarkdown from "react-markdown"

import { Code } from "react-lezer-highlighter"

interface CodeProps {
	inline?: boolean
	className?: string
	children: React.ReactNode[]
}

interface ImgProps {
	src?: string
	alt?: string
}

const components = {
	code(props: CodeProps) {
		if (props.inline) {
			return <code>{props.children}</code>
		} else {
			const source = String(props.children).replace(/\n+$/, "")
			return <Code language={props.className} source={source} />
		}
	},
	img(props: ImgProps) {
		return <img srcSet={`${props.src} 2x`} alt={props.alt} />
	},
}

export interface MarkdownProps {
	source: string
}

export default function Markdown(props: MarkdownProps) {
	return <ReactMarkdown components={components}>{props.source}</ReactMarkdown>
}
