import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { dracula } from "react-syntax-highlighter/dist/esm/styles/prism";
import ReactMarkdown, { Components } from "react-markdown";

const CodeBlock = ({ node, inline, className, children, ...props }: any) => {
  const match = /language-(\w+)/.exec(className || "");
  return !inline && match ? (
    <SyntaxHighlighter
      style={dracula}
      language={match[1]}
      PreTag="div"
      {...props}
    >
      {String(children).replace(/\n$/, "")}
    </SyntaxHighlighter>
  ) : (
    <code className={className} {...props}>
      {children}
    </code>
  );
};

const MarkdownRenderer = ({ markdownContent }: { markdownContent: string }) => {
  const components: Components = {
    code: CodeBlock,
  };

  return (
    <ReactMarkdown components={components}>{markdownContent}</ReactMarkdown>
  );
};

export default MarkdownRenderer;
