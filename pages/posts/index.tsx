import React from "react"
import type { GetStaticProps } from "next"

import { readdirSync } from "node:fs"
import { resolve } from "node:path"

import { getTitle, PageProps } from "utils/pages"

type Post = { date: string; slug: string; title: string }

interface PostIndexPageProps extends PageProps {
	posts: Post[]
}

export const config = {
	unstable_runtimeJS: false,
}

async function getPosts(): Promise<Post[]> {
	const posts: Post[] = []
	for (const date of readdirSync(resolve("content", "posts"))) {
		for (const name of readdirSync(resolve("content", "posts", date))) {
			const title = await getTitle(resolve("content", "posts", date, name))
			const slug = name.slice(0, name.lastIndexOf(".md"))
			posts.push({ date, slug, title })
		}
	}

	posts.sort(({ date: a }, { date: b }) => (a === b ? 0 : a < b ? 1 : -1))
	return posts
}

export const getStaticProps: GetStaticProps<PostIndexPageProps, {}> =
	async ({}) => {
		const posts = await getPosts()
		return { props: { path: ["posts"], posts, title: "Posts" } }
	}

export default function PostIndexPage({ posts, ...props }: PostIndexPageProps) {
	return (
		<>
			<h1>Posts</h1>
			{posts.map(({ slug, title, date }) => (
				<p key={slug}>
					<em>{date}</em> · <a href={`/posts/${date}/${slug}`}>{title}</a>
				</p>
			))}
		</>
	)
}