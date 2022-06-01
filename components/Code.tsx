import React from "react"

import { fromLezer } from "hast-util-from-lezer"
import { toH } from "hast-to-hyperscript"

// import type { LRLanguage } from "@codemirror/language"
import type { LRParser } from "@lezer/lr"
// import {
// 	javascriptLanguage,
// 	jsxLanguage,
// 	typescriptLanguage,
// 	tsxLanguage,
// } from "@codemirror/lang-javascript"

import { parser as javascriptParser } from "@lezer/javascript"
import { parser as lezerParser } from "@lezer/lezer"

// import { lezerLanguage } from "@codemirror/lang-lezer"

// const languages: Record<string, LRLanguage> = {
// 	"language-typescript": typescriptLanguage,
// 	"language-ts": typescriptLanguage,
// 	"language-tsx": tsxLanguage,
// 	"language-javascript": javascriptLanguage,
// 	"language-js": javascriptLanguage,
// 	"language-jsx": jsxLanguage,
// 	"language-lezer": lezerLanguage,
// }

const languages: Record<string, LRParser> = {
	"language-typescript": javascriptParser.configure({ dialect: "ts" }),
	"language-ts": javascriptParser.configure({ dialect: "ts" }),
	"language-tsx": javascriptParser.configure({ dialect: "ts jsx" }),
	"language-javascript": javascriptParser,
	"language-js": javascriptParser,
	"language-jsx": javascriptParser.configure({ dialect: "jsx" }),
	"language-lezer": lezerParser,
}

export interface CodeProps {
	language?: string
	children: React.ReactNode
}

export const Code: React.FC<CodeProps> = (props) => {
	if (props.language !== undefined && props.language in languages) {
		const source = String(props.children).replace(/\n+$/, "")
		const parser = languages[props.language]
		const tree = parser.parse(source)
		const root = fromLezer(source, tree)
		const content = toH(React.createElement, root)
		return <code className={props.language}>{content}</code>
	} else {
		return <code className={props.language}>{props.children}</code>
	}
}
