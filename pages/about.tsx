import React from "react"
import type { GetStaticProps } from "next"

import { readFileSync } from "fs"
import { resolve } from "path"

import Markdown from "components/Markdown"

import { PageProps } from "utils/pages"

interface ContentPageProps extends PageProps {
	source: string
}

export const config = {
	unstable_runtimeJS: false,
}

export const getStaticProps: GetStaticProps<ContentPageProps, {}> = async (
	context
) => {
	const file = resolve("content", "about.md")
	const source = readFileSync(file, "utf-8")

	return {
		props: { path: [], source, title: "About" },
	}
}

export default function AboutPage({ source }: ContentPageProps) {
	return <Markdown source={source} />
}
