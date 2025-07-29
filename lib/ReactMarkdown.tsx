import SyntaxHighlighter from "react-syntax-highlighter";
import { vscDarkPlus } from "react-syntax-highlighter/dist/esm/styles/prism";
 const ReactMarkdown = ({
  inline,
  className,
  children,
  ...props
}: {
  inline?: boolean;
  className?: string;
  children?: React.ReactNode;
}) => {
  const match = /language-(\w+)/.exec(className || "");
  return !inline && match ? (
    <SyntaxHighlighter
      style={vscDarkPlus}
      language={match[1]}
      PreTag="div"
      customStyle={{
        padding: "1rem",
        borderRadius: "0.5rem",
        fontSize: "0.875rem",
      }}
      wrapLongLines={true}
      showLineNumbers={true}
      {...props}
    >
      {String(children).replace(/\n$/, "")}
    </SyntaxHighlighter>
  ) : (
    <code className="bg-gray-200 px-1 py-0.5 rounded text-sm">{children}</code>
  );
};

export default ReactMarkdown;