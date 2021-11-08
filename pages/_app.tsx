import React from "react"
import type { AppProps } from "next/app"
import Head from "next/head"

import type { PageProps } from "utils/pages"

import "hast-util-from-codemirror/styles/default.css"
import "../style.css"

export default function App(props: AppProps<PageProps>) {
	const { Component, pageProps } = props
	const title = pageProps.title
		? `${pageProps.title} | Joel Gustafson`
		: "Joel Gustafson"

	return (
		<>
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
		</>
	)
}
