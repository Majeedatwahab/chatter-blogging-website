import { FC } from "react";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { dracula } from "react-syntax-highlighter/dist/esm/styles/prism";

interface CodeBlockProps {
  language: string;
  value: string;
  inline?: boolean;
}

const CodeBlock: FC<CodeBlockProps> = ({ language, value, inline = false }) => {
  return inline ? (
    <code>{value}</code>
  ) : (
    <SyntaxHighlighter language={language} style={dracula}>
      {value}
    </SyntaxHighlighter>
  );
};

export default CodeBlock;
