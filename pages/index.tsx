import React from "react"
import type { GetStaticProps } from "next"

import { readFileSync } from "node:fs"
import { resolve } from "node:path"

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
	const file = resolve("content", "index.md")
	const source = readFileSync(file, "utf-8")

	return {
		props: { path: [], source },
	}
}

export default function IndexPage({ source }: ContentPageProps) {
	return <Markdown source={source} />
}
