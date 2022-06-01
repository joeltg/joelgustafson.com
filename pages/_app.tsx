import React from "react"
import type { AppProps } from "next/app"
import Head from "next/head"

import type { PageProps } from "utils/pages"

import { parser as javascriptParser } from "@lezer/javascript"
import { parser as lezerParser } from "@lezer/lezer"

import "react-lezer-highlighter/styles/default.css"
import "../style.css"
import { Parsers } from "react-lezer-highlighter"

const parsers = {
	"language-javascript": javascriptParser,
	"language-js": javascriptParser,
	"language-jsx": javascriptParser.configure({ dialect: "jsx" }),
	"language-typescript": javascriptParser.configure({ dialect: "ts" }),
	"language-ts": javascriptParser.configure({ dialect: "ts" }),
	"language-tsx": javascriptParser.configure({ dialect: "ts jsx" }),
	"language-lezer": lezerParser,
}

export default function App(props: AppProps<PageProps>) {
	const { Component, pageProps } = props
	const title = pageProps.title
		? `${pageProps.title} | Joel Gustafson`
		: "Joel Gustafson"

	return (
		<Parsers.Provider value={parsers}>
			<Head>
				<title>{title}</title>
				<link rel="icon" href="/favicon.png" type="image/png" />
				<link
					rel="preload"
					href="/LyonText-Regular-Web.woff2"
					as="font"
					type="font/woff2"
					crossOrigin="anonymous"
				/>
				<link
					rel="preload"
					href="/LyonText-RegularItalic-Web.woff2"
					as="font"
					type="font/woff2"
					crossOrigin="anonymous"
				/>
				<link
					rel="preload"
					href="/LyonText-Semibold-Web.woff2"
					as="font"
					type="font/woff2"
					crossOrigin="anonymous"
				/>
				<link
					rel="preload"
					href="/LyonText-SemiboldItalic-Web.woff2"
					as="font"
					type="font/woff2"
					crossOrigin="anonymous"
				/>
			</Head>
			<main>
				<article>
					<Component {...pageProps} />
				</article>
			</main>
		</Parsers.Provider>
	)
}
