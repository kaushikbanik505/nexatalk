import { useMemo, useState } from "react";
import { Link } from "react-router";
import toast from "react-hot-toast";
import {
  ArrowDownWideNarrowIcon,
  ArrowLeftIcon,
  CheckIcon,
  ChevronDownIcon,
  ChevronRightIcon,
  CopyIcon,
  FileCodeIcon,
  FolderTreeIcon,
  StarIcon,
} from "lucide-react";
import { SOURCE } from "../data/generatedSource";
import { highlightLines } from "../lib/highlightCode";

// Full literal Tailwind/daisyUI color-key strings only, never a computed template.
const BORDER_L_COLOR = {
  primary: "border-l-primary",
  secondary: "border-l-secondary",
  accent: "border-l-accent",
  info: "border-l-info",
  warning: "border-l-warning",
  success: "border-l-success",
};

const ICON_BADGE_COLOR = {
  primary: "bg-primary/10 text-primary",
  secondary: "bg-secondary/10 text-secondary",
  accent: "bg-accent/10 text-accent",
  info: "bg-info/10 text-info",
  warning: "bg-warning/10 text-warning",
  success: "bg-success/10 text-success",
};

const TEXT_COLOR = {
  primary: "text-primary",
  secondary: "text-secondary",
  accent: "text-accent",
  info: "text-info",
  warning: "text-warning",
  success: "text-success",
};

const importanceTierClass = (importance) => {
  if (importance >= 9) return "bg-error/10 text-error border-error/20";
  if (importance >= 7) return "bg-warning/10 text-warning border-warning/20";
  if (importance >= 5) return "bg-info/10 text-info border-info/20";
  return "bg-base-content/10 text-base-content/50 border-base-content/10";
};

const StatChip = ({ label, value }) => (
  <span className="inline-flex items-center gap-1.5 rounded-full border border-base-300/50 bg-base-200/70 backdrop-blur-sm px-4 py-1.5 text-sm font-medium">
    <span className="font-semibold">{value}</span>
    <span className="text-base-content/50">{label}</span>
  </span>
);

const FileCard = ({ file, color, expanded, onToggle }) => {
  const code = SOURCE[file.path] ?? "// source not found - run npm run docs:sync";
  const lines = useMemo(() => code.split("\n"), [code]);
  const highlighted = useMemo(() => (expanded ? highlightLines(code) : null), [code, expanded]);
  const lineCount = lines.length;
  const fileName = file.path.split("/").pop();
  const folderPath = file.path.slice(0, file.path.length - fileName.length);
  const [copied, setCopied] = useState(false);

  const handleCopy = (e) => {
    e.stopPropagation();
    navigator.clipboard.writeText(code);
    setCopied(true);
    toast.success("Code copied!");
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div
      className={`rounded-2xl border border-base-300/50 border-l-4 bg-base-200/40 overflow-hidden transition-colors hover:border-base-300 ${BORDER_L_COLOR[color]}`}
    >
      <div className="px-5 sm:px-6 pt-5 flex items-start gap-3.5">
        <span
          className={`flex items-center justify-center size-9 rounded-xl shrink-0 ${ICON_BADGE_COLOR[color]}`}
        >
          <FileCodeIcon className="size-4.5" />
        </span>
        <div className="min-w-0 flex-1 pt-0.5">
          <p className="font-mono text-[11px] text-base-content/40 truncate leading-none mb-1">
            {folderPath}
          </p>
          <p className="font-mono text-[15px] font-bold truncate leading-tight">{fileName}</p>
        </div>
        <span
          title={`Importance: ${file.importance}/10`}
          className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-1 text-xs font-semibold shrink-0 ${importanceTierClass(
            file.importance
          )}`}
        >
          <StarIcon className="size-3" fill="currentColor" />
          {file.importance}/10
        </span>
      </div>

      <div className="px-5 sm:px-6 pt-3.5 pb-5 space-y-2.5">
        {file.explanation.map((para, idx) => (
          <p key={idx} className="text-sm text-base-content/70 leading-relaxed">
            {para}
          </p>
        ))}
      </div>

      <button
        type="button"
        onClick={() => onToggle(file.path)}
        className="w-full flex items-center justify-between gap-2 px-5 sm:px-6 py-3 border-t border-base-300/40 bg-base-300/10 hover:bg-base-300/25 transition-colors text-left"
      >
        <span className="flex items-center gap-2 text-sm font-medium min-w-0">
          <ChevronRightIcon
            className={`size-4 shrink-0 transition-transform duration-200 ${
              expanded ? "rotate-90" : ""
            }`}
          />
          <span className="font-mono truncate">{fileName}</span>
          <span className="text-base-content/40 shrink-0">({lineCount} lines)</span>
        </span>
        {expanded && (
          <span
            role="button"
            tabIndex={0}
            onClick={handleCopy}
            onKeyDown={(e) => e.key === "Enter" && handleCopy(e)}
            className="btn btn-ghost btn-xs gap-1.5 shrink-0 normal-case"
          >
            {copied ? (
              <CheckIcon className="size-3.5 text-success" />
            ) : (
              <CopyIcon className="size-3.5" />
            )}
            {copied ? "Copied" : "Copy"}
          </span>
        )}
      </button>

      {expanded && (
        <div className="bg-[#0d1117] overflow-x-auto animate-code-reveal">
          <div className="min-w-max">
            {highlighted.map((html, i) => (
              <div key={i} className="flex hover:bg-white/[0.03]">
                <span className="w-12 shrink-0 select-none text-right pr-4 py-0.5 text-[11px] leading-[1.6] text-slate-600 sm:text-xs">
                  {i + 1}
                </span>
                <code
                  className="flex-1 pr-5 py-0.5 text-[12px] sm:text-[13px] leading-[1.6] font-mono text-slate-300 whitespace-pre"
                  dangerouslySetInnerHTML={{ __html: html }}
                />
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

const CodeFileExplorer = ({
  eyebrow,
  eyebrowColorClass,
  headerColor,
  title,
  rootLabel,
  files,
  folderOrder,
  folderLabels,
  folderColors,
}) => {
  const [sortMode, setSortMode] = useState("folder");
  const [expanded, setExpanded] = useState(() => new Set());

  const toggle = (path) => {
    setExpanded((prev) => {
      const next = new Set(prev);
      if (next.has(path)) next.delete(path);
      else next.add(path);
      return next;
    });
  };

  const stats = useMemo(() => {
    const totalLines = files.reduce(
      (sum, f) => sum + (SOURCE[f.path]?.split("\n").length ?? 0),
      0
    );
    const avgImportance = files.reduce((sum, f) => sum + f.importance, 0) / files.length;
    return { totalLines, avgImportance: avgImportance.toFixed(1) };
  }, [files]);

  const groups = useMemo(() => {
    if (sortMode === "importance") {
      const sorted = [...files].sort((a, b) => b.importance - a.importance);
      return [{ folder: null, label: null, items: sorted }];
    }
    return folderOrder
      .map((folder) => ({
        folder,
        label: folderLabels[folder],
        color: folderColors[folder],
        items: files.filter((f) => f.folder === folder),
      }))
      .filter((g) => g.items.length > 0);
  }, [files, sortMode, folderOrder, folderLabels, folderColors]);

  return (
    <div className="min-h-screen bg-base-100">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10 space-y-8">
        <Link
          to="/learn"
          className="inline-flex items-center gap-1.5 text-sm text-base-content/60 hover:text-base-content transition-colors"
        >
          <ArrowLeftIcon className="size-4" />
          Back to Learner
        </Link>

        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <span
              className={`flex items-center justify-center size-10 rounded-xl shrink-0 ${ICON_BADGE_COLOR[headerColor]}`}
            >
              <FileCodeIcon className="size-5" />
            </span>
            <p className={`text-xs font-semibold tracking-widest ${eyebrowColorClass}`}>
              {eyebrow}
            </p>
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight">{title}</h1>
          <p className="text-base-content/70 max-w-2xl">
            All {files.length} files under {rootLabel}. Click a file's header to expand its code -
            each one already has its explanation open below it.
          </p>
          <div className="flex flex-wrap items-center gap-2.5 pt-1">
            <StatChip label="files documented" value={files.length} />
            <StatChip label="lines of real code" value={stats.totalLines.toLocaleString()} />
            <StatChip label="avg. importance" value={`${stats.avgImportance}/10`} />
          </div>
        </div>

        <div className="inline-flex items-center gap-1 rounded-full border border-base-300/50 bg-base-200/70 backdrop-blur-sm p-1">
          <button
            type="button"
            onClick={() => setSortMode("folder")}
            className={`inline-flex items-center gap-1.5 rounded-full px-4 py-1.5 text-sm font-medium transition-colors ${
              sortMode === "folder"
                ? "bg-primary text-primary-content"
                : "text-base-content/60 hover:text-base-content"
            }`}
          >
            <FolderTreeIcon className="size-3.5" />
            Folder order
          </button>
          <button
            type="button"
            onClick={() => setSortMode("importance")}
            className={`inline-flex items-center gap-1.5 rounded-full px-4 py-1.5 text-sm font-medium transition-colors ${
              sortMode === "importance"
                ? "bg-primary text-primary-content"
                : "text-base-content/60 hover:text-base-content"
            }`}
          >
            <ArrowDownWideNarrowIcon className="size-3.5" />
            Most important first
          </button>
        </div>

        <div className="space-y-10">
          {groups.map((group) => (
            <div key={group.folder ?? "importance"} className="space-y-4">
              {group.label && (
                <div className="flex items-center gap-2 sticky top-0 z-10 -mx-4 sm:-mx-6 px-4 sm:px-6 py-2 bg-base-100/90 backdrop-blur-sm">
                  <span className={`size-1.5 rounded-full ${TEXT_COLOR[group.color]} bg-current`} />
                  <p className="font-mono text-xs text-base-content/50">{group.label}</p>
                  <span className="text-xs text-base-content/30">
                    {group.items.length} {group.items.length === 1 ? "file" : "files"}
                  </span>
                </div>
              )}
              <div className="space-y-4">
                {group.items.map((file) => (
                  <FileCard
                    key={file.path}
                    file={file}
                    color={folderColors[file.folder]}
                    expanded={expanded.has(file.path)}
                    onToggle={toggle}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="flex items-center gap-2 text-sm text-base-content/40 pt-4 border-t border-base-300/40">
          <ChevronDownIcon className="size-3.5" />
          That's every file. Nothing hidden, nothing summarized away.
        </div>
      </div>
    </div>
  );
};

export default CodeFileExplorer;
