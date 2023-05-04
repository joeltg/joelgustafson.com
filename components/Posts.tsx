import React from "react"

import styles from "./Posts.module.scss"

export type Post = { date: string; slug: string; title: string }

interface PostsProps {
	posts: Post[]
}

export default function Posts({ posts }: PostsProps) {
	return (
		<table className={styles.table}>
			<tbody>
				{posts.map(({ slug, title, date }) => (
					<tr key={slug}>
						<td className="date">{date}</td>
						<td className="dot">·</td>
						<td>
							<a href={`/posts/${date}/${slug}`}>{title}</a>
						</td>
					</tr>
				))}
			</tbody>
		</table>
	)
}
