# Syntax highlighting on the web

_2022-05-31_

How does syntax highlighting work?

In IDEs, syntax highlighting has traditionally been implemented in a _mode-based pattern matching_ approach. Each language "grammar" defines a set of scopes, regular expressions that match different kinds of tokens in each scope, and inclusions of scopes inside other scopes. The capturing groups in the regular expressions are then associated with names in some taxonomy that themes interface with.

I put "grammar" in quotes because they're very different from actual formal grammars (ABNF etc). Code editing as we know it is really a stack of several mostly-independent features, each of which has different priorities and ends up involving a different version of "parsing". IDEs mostly want syntax highlighting to be _fast_ and _forgiving_. We expect our tokens to be colored "correctly" even in invalid/intermediate states, and we expect highlighting to happen basically instantly. This means that lots of systems converged on loose regex-based approaches that could identify keywords and operators and atoms without needing to parse the source into an actual AST.

One downside to mode-based pattern matching is that it is fundamentally a very coarse version of parsing, and getting grammars to distinguish between things like function calls and variable names can be prohibitively complicated. Writing and maintaining these grammars is also a massive pain, because it requires thinking about the syntax of the language in unintuitive ways. [This blog post](https://www.apeth.com/nonblog/stories/textmatebundle.html) is a good summary of just how much cognitive overhead there is in learning to write TexMate grammars, which are what VS Code uses. It doesn't help that the TexMate grammar format is itself largely undocumented.

Here's VS Code team member @alexdima commenting on the limitations of TexMate grammars.

[![a comment on GitHub from a VS Code team member about the limitations of TexMate grammars](</Screenshot 2022-05-31 at 21-13-26.png>)](https://github.com/microsoft/vscode/issues/77140#issue-466517908)

@alexdima also included a screenshot of VS Code's TexMate grammar for TypeScript which is just too funny not to pass on.

![a screenshot of the TypeScript TexMate grammar is a page-long regular expression comprised mostly of escape characters](/typescript-texmate.png)

Clearly this is not ideal.

---

In 2018, Max Brunsfeld on the Atom team at GitHub released [tree-sitter](https://tree-sitter.github.io/tree-sitter/), a brand new parsing system designed to serve as a modern foundation for code analysis and syntax highlighting in editors.

tree-sitter is a big deal. It's fundamentally different than the mode-based pattern matching that everyone else has been doing, and acts much more like a real parser that gives you an traditional AST to work with. The technical details are way beyond me, but it seems like Max was able to apply some modern research on incremental parsing to hit a sweet spot of performance, generality, and error tolerance that just wasn't possible with parser generators before. Also it's written in Rust so Hacker News automatically loves it.

[![a comment on Hacker News praising tree-sitter](</Screenshot 2022-05-31 at 21-11-19.png>)](https://news.ycombinator.com/item?id=26226392)

You still have to write a grammar for each language, but they're structured like the AST, and as a result can be used for other editor features beyond syntax highlighting (the [release blog post](https://github.blog/2018-10-31-atoms-new-parsing-system/) calls out code folding but lots more is possible). tree-sitter grammars are simultaneously more concise and more powerful than mode-based pattern matching: we obviously shouldn't take LOC too seriously, but [tree-sitter-javascript/grammar.js](https://github.com/tree-sitter/tree-sitter-javascript/blob/master/grammar.js) is "just" 1156 lines while [VSCode's JavaScript TexMate grammar](https://github.com/microsoft/vscode-textmate/blob/main/test-cases/themes/syntaxes/JavaScript.tmLanguage.json) is over 3500. More importantly, it's not mostly escape characters.

[![a comment on GitHub comparing TexMate and tree-sitter](</Screenshot 2022-05-31 at 21-08-01.png>)](https://github.com/microsoft/vscode/issues/50140#issuecomment-463299445)

[![a comment on Hacker News from tree-sitter author comparing tree-sitter and Visual Studio Code's Language Server Protocol](</Screenshot 2022-05-31 at 16-33-42.png>)](https://news.ycombinator.com/item?id=18349488)

It can't do everything. We still need language servers for autocomplete and type-checking and whatnot, but it does dramatically increase the degree of structure available to IDEs without calling out to separate processes.

It's 2022 now, and Atom is mostly dead, but tree-sitter lives on: GitHub uses it for syntax highlighting and the [jump-to-definition feature](https://docs.github.com/en/repositories/working-with-files/using-files/navigating-code-on-github) (!!), [SemGrep](https://r2c.dev/) uses it for static analysis, and there's lots of [ongoing discussion](https://github.com/microsoft/vscode/issues/50140) about integrating it into other IDEs.

---

But what does any of this have to do with the web? Is highlighting code snippets on a programming blog or docs website even the same problem as highlighting inside an IDE?

Honestly _no_, not at all! Error tolerance, incremental parsing, and performance (the major constraints that justified the regular expression approach) just aren't as relevant. In the context of a static site generator or React component, it's probably safe to assume that the source code is syntactically well-formed. On the web, "syntax highlighting" just means rendering the whole thing to HTML in a single pass.

But mode-based pattern matching is the state of the art on the web anyway. The two big JavaScript syntax highlighting libraries today are [highlight.js](https://github.com/highlightjs/highlight.js/) and [PrismJS](https://github.com/PrismJS/prism/), each of which use their own nested regex grammar format. They're both fantastic libraries, and the product of an absolutely massive community effort to maintain grammars for all the languages they support. But tree-sitter proved that reasonably general parser generators are possible, and that they're a cleaner way to get fine-grained syntax highlighting, so it's natural to wonder if something like it can be adapted for the web.

One option would be to just use tree-sitter through WASM; [`web-tree-sitter`](https://www.npmjs.com/package/web-tree-sitter) does exactly this. But although WASM _can_ run anywhere, using it in modern web stacks is still a pain - you have to load the WASM blob, which requires hosting and serving it to browsers, using WASM means waiting for async module initialization, and it makes server-side rendering difficult ([Shiki](https://github.com/shikijs/shiki), another popular web syntax highlighter, uses VS Code's TexMate library compiled to WASM, and [suffers from this limitation](https://github.com/shikijs/shiki/issues/138)).

So ideally we'd have a pure-JavaScript alternative. Fortunately for us, somebody has already done the hard part! Marijn Haverbeke (The CodeMirror Guy) has completely rewritten CodeMirror from the ground up for [version 6](https://codemirror.net/6/), and spun out as a separate project an adaptation of tree-sitter called [Lezer](https://lezer.codemirror.net/). Lezer is a parser generator system: it has its own syntax for writing `.grammar` files, but uses them to generate zero-dependency pure JavaScript LR parsers. From the [reference page](https://lezer.codemirror.net/docs/guide/):

> This system's approach is heavily influenced by tree-sitter, a similar system written in C and Rust, and several papers by Tim Wagner and Susan Graham on incremental parsing ([1](https://lezer.codemirror.net/docs/guide/ftp.cs.berkeley.edu/sggs/toplas-parsing.ps), [2](https://www.semanticscholar.org/paper/Incremental-Analysis-of-real-Programming-Languages-Wagner-Graham/163592ac3777ee396f32318fcd83b1c563f2e496)). It exists as a different system because it has different priorities than tree-sitter—as part of a JavaScript system, it is written in JavaScript, with relatively small library and parser table size. It also generates more compact in-memory trees, to avoid putting too much pressure on the user's machine.

(I feel obliged to mention that Marijn's work has been very personally inspiring. The code he writes is incredibly principled and well thought-out; I felt like I connected with a clearer sense of software design just by reading through the CodeMirror 6 codebase.)

Anyway: Lezer parsers are the basis of syntax highlighting and other code analysis features in CodeMirror 6, but are also usable on their own. This is important because although CodeMirror is a fantastically well-engineered piece of software, it is also very opinionated about things — for example, it can't be server-side rendered, interacts with the DOM on its own terms, and requires a bit of boilerplate to use with React. But Lezer is a standalone zero-dependency system that can run anywhere, with or without the rest of CodeMirror.

---

This means we can use Lezer to build a simple, pure-JavaScript syntax highlighting system for React.

I've released a reference module implementing this as [`react-lezer-highlighter`](https://www.npmjs.com/package/react-lezer-highlighter) on NPM. Here's the entire source code!

```tsx
import React, { createContext, useContext } from "react"

import { fromLezer } from "hast-util-from-lezer"
import { toH } from "hast-to-hyperscript"

import type { LRParser } from "@lezer/lr"

export const Parsers = createContext<Record<string, LRParser>>({})

export interface CodeProps {
	language?: string
	source: string
}

export const Code: React.FC<CodeProps> = (props) => {
	const parsers = useContext(Parsers)
	if (props.language !== undefined && props.language in parsers) {
		const parser = parsers[props.language]
		const tree = parser.parse(props.source)
		const root = fromLezer(props.source, tree)
		const content = toH(React.createElement, root)
		return <code className={props.language}>{content}</code>
	} else {
		return <code className={props.language}>{props.source}</code>
	}
}
```

I personally don't like it when libraries vendor lots dependencies, so here I'm using a React Context called `Parsers` to that you have to populate yourself with Lezer parsers for the languages that you want to use. You can find the officially-maintained parsers as repos in the [lezer-parser GitHub organization](https://github.com/lezer-parser), search for third-party ones, or write your own.

That [`hast-util-from-lezer` library](https://github.com/joeltg/hast-util-from-lezer) is a separate utility module that performs the parse tree traversal and returns a [HAST](https://github.com/syntax-tree/hast) root. The HAST root it returns could also e.g. be serialized to HTML using [hast-util-to-html](https://github.com/syntax-tree/hast-util-to-html). It produces a flat array of `span` elements each with (possibly several) classnames like `tok-variableName`, `tok-punctuation`, etc that it [gets from Lezer](https://github.com/lezer-parser/highlight/blob/2986163f9570a3b45df8d0c543d138a5a755dcfe/src/highlight.ts#L641). Here's _its_ entire source code:

```ts
import { highlightTree, classHighlighter } from "@lezer/highlight"

import type { Element, Text, Root } from "hast"
import type { Tree } from "@lezer/common"

export function fromLezer(source: string, tree: Tree): Root {
	const children: (Element | Text)[] = []
	let index = 0

	highlightTree(tree, classHighlighter, (from, to, classes) => {
		if (from > index) {
			children.push({ type: "text", value: source.slice(index, from) })
		}

		children.push({
			type: "element",
			tagName: "span",
			properties: { className: classes },
			children: [{ type: "text", value: source.slice(from, to) }],
		})

		index = to
	})

	if (index < source.length) {
		children.push({ type: "text", value: source.slice(index) })
	}

	return { type: "root", children }
}
```

Pretty neat! We have a functional synchronous syntax highlighter that works everywhere. I'm using it to render this webpage, and you can also [check it out on GitHub](https://github.com/joeltg/react-lezer-highlighter). Feel free to use it in your next project, or just copy the ~100 lines and adapt them as you see fit!
