import React from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeSlug from "rehype-slug";
import rehypeHighlight from "rehype-highlight";

/**
 * Article body renderer: GitHub-flavoured Markdown (tables, task lists,
 * strikethrough), heading anchors, highlighted code. Raw HTML is not
 * rendered, so pasted content can't inject scripts.
 */
export default function Markdown({ children, className = "" }: { children: string; className?: string }) {
  return (
    <div className={`prose-article ${className}`}>
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[rehypeSlug, [rehypeHighlight, { detect: true, ignoreMissing: true }]]}
        components={{
          a: ({ href = "", children, ...rest }) => {
            const external = /^https?:\/\//.test(href);
            return (
              <a href={href} {...rest} {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}>
                {children}
              </a>
            );
          },
          img: ({ src, alt }) => (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={typeof src === "string" ? src : ""} alt={alt ?? ""} loading="lazy" />
          ),
        }}
      >
        {children}
      </ReactMarkdown>
    </div>
  );
}
