import React from "react";
import ReactMarkdown from "react-markdown";
import rehypeRaw from "rehype-raw";
import { slug } from "github-slugger";
import { Code } from "react-lezer-highlighter";

const flatten = (text: string, child: React.ReactNode): string => {
  if (typeof child === "string") {
    return text + child;
  } else if (React.isValidElement(child)) {
    return React.Children.toArray(child.props.children).reduce(flatten, text);
  } else {
    return text;
  }
};

const Anchor = (props: { id: string; children?: React.ReactNode }) => (
  <a href={`#${props.id}`}>
    <span className="anchor">#</span>
    <span>{props.children}</span>
  </a>
);

interface CodeProps {
  inline?: boolean;
  className?: string;
  children?: React.ReactNode;
}

const components = {
  code(props: CodeProps) {
    if (props.inline) {
      return <code>{props.children}</code>;
    } else {
      const source = String(props.children).replace(/\n+$/, "");
      return <Code language={props.className} source={source} />;
    }
  },
  img(props: { src?: string; alt?: string }) {
    return <img srcSet={`${props.src} 2x`} {...props} />;
  },
  h1: (props: { children?: React.ReactNode }) => {
    return <h1>{props.children}</h1>;
  },
  h2: (props: { children?: React.ReactNode }) => {
    const children = React.Children.toArray(props.children);
    const id = slug(children.reduce(flatten, ""));
    return (
      <h2 id={id}>
        <Anchor id={id}>{props.children}</Anchor>
      </h2>
    );
  },
  h3: (props: { children?: React.ReactNode }) => {
    const children = React.Children.toArray(props.children);
    const id = slug(children.reduce(flatten, ""));
    return (
      <h3 id={id}>
        <Anchor id={id}>{props.children}</Anchor>
      </h3>
    );
  },
};

export interface MarkdownProps {
  source: string;
}

export default function Markdown(props: MarkdownProps) {
  return (
    <ReactMarkdown rehypePlugins={[rehypeRaw]} components={components}>
      {props.source}
    </ReactMarkdown>
  );
}
