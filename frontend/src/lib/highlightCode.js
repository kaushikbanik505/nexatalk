// A small, dependency-free syntax highlighter for the /learn/backend and /learn/frontend
// file-explorer pages. Not a real tokenizer/parser - just enough regex-based coloring
// (comments, strings, keywords, numbers) to make embedded source readable, without pulling
// in a library like prismjs/react-syntax-highlighter for what is otherwise static text.

const KEYWORDS =
  "import|export|from|default|const|let|var|function|return|if|else|for|while|do|try|catch|finally|throw|new|class|extends|super|async|await|of|in|typeof|instanceof|null|undefined|true|false|this|delete|void|yield|switch|case|break|continue";

// Deliberately line-scoped (no multiline block-comment span) so each line can be
// highlighted independently and paired with its own line-number gutter row.
const TOKEN_REGEX = new RegExp(
  [
    "(\\/\\/.*$)", // 1: line comment
    "(`(?:\\\\.|[^`\\\\])*`|\"(?:\\\\.|[^\"\\\\])*\"|'(?:\\\\.|[^'\\\\])*')", // 2: string/template
    `\\b(${KEYWORDS})\\b`, // 3: keyword
    "\\b(\\d+(?:\\.\\d+)?)\\b", // 4: number
  ].join("|"),
  "g"
);

const escapeHtml = (str) =>
  str.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

const highlightLine = (line) => {
  let result = "";
  let lastIndex = 0;
  let match;

  TOKEN_REGEX.lastIndex = 0;
  while ((match = TOKEN_REGEX.exec(line)) !== null) {
    result += escapeHtml(line.slice(lastIndex, match.index));
    const [full, comment, string, keyword, number] = match;

    if (comment) {
      result += `<span class="text-slate-500 italic">${escapeHtml(comment)}</span>`;
    } else if (string) {
      result += `<span class="text-emerald-400">${escapeHtml(string)}</span>`;
    } else if (keyword) {
      result += `<span class="text-pink-400 font-medium">${escapeHtml(keyword)}</span>`;
    } else if (number) {
      result += `<span class="text-amber-400">${escapeHtml(number)}</span>`;
    } else {
      result += escapeHtml(full);
    }
    lastIndex = match.index + full.length;
  }
  result += escapeHtml(line.slice(lastIndex));
  return result || "&nbsp;";
};

// Returns an array of highlighted HTML strings, one per source line. Safe to use with
// dangerouslySetInnerHTML because the only input is our own static, generated source code,
// never user input.
export const highlightLines = (code) => code.split("\n").map(highlightLine);
