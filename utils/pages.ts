import { createReadStream } from "node:fs"
import * as readline from "node:readline"

export interface PageProps {
	title?: string
	path: string[]
}

export async function getTitle(path: string): Promise<string> {
	const readable = createReadStream(path)
	const reader = readline.createInterface({ input: readable })

	const line = await new Promise<string>((resolve, reject) => {
		reader.on("line", (line) => {
			reader.close()
			resolve(line)
		})
	})

	if (line.startsWith("# ")) {
		return line.slice(2)
	} else {
		throw new Error("markdown file must begin with h1 header")
	}
}
