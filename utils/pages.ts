import { createReadStream } from "fs";
import * as readline from "readline";

export interface PageProps {
  title?: string;
  path: string[];
}

export async function getTitle(path: string): Promise<string> {
  const readable = createReadStream(path);
  const reader = readline.createInterface({ input: readable });

  const line = await new Promise<string>((resolve, reject) => {
    reader.on("line", (line) => {
      reader.close();
      resolve(line);
    });
  });

  if (line.startsWith("# ")) {
    return line.slice(2);
  } else {
    console.error(path);
    throw new Error("markdown file must begin with h1 header");
  }
}
