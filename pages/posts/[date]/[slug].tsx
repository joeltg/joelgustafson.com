import React from "react"
import type { GetStaticPaths, GetStaticProps } from "next"

import { readFileSync, readdirSync } from "fs"
import { resolve } from "path"

import Markdown from "components/Markdown"

import { getTitle, PageProps } from "utils/pages"

type PostPageParams = { date: string; slug: string }

interface PostPageProps extends PageProps {
	date: string
	source: string
}

export const config = {
	unstable_runtimeJS: false,
}

function* getPaths(): Iterable<{ params: PostPageParams }> {
	for (const date of readdirSync(resolve("content", "posts"))) {
		for (const name of readdirSync(resolve("content", "posts", date))) {
			if (name.endsWith(".md")) {
				const slug = name.slice(0, name.lastIndexOf(".md"))
				yield { params: { date, slug } }
			}
		}
	}
}

export const getStaticPaths: GetStaticPaths<PostPageParams> = async ({}) => {
	return { paths: Array.from(getPaths()), fallback: false }
}

export const getStaticProps: GetStaticProps<PostPageProps, PostPageParams> =
	async (context) => {
		if (context.params === undefined) {
			return { notFound: true }
		}

		const { date, slug } = context.params
		const file = resolve("content", "posts", date, `${slug}.md`)
		const source = readFileSync(file, "utf-8")
		const title = await getTitle(file)

		return {
			props: { path: ["posts", date, slug], source, date, title },
		}
	}

export default function PostPage({ source }: PostPageProps) {
	return <Markdown source={source} />
}
