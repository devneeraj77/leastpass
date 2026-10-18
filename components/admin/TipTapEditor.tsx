"use client";

import React, { useEffect, useState } from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Placeholder from "@tiptap/extension-placeholder";
import Link from "@tiptap/extension-link";
import {
  Bold,
  Italic,
  Strikethrough,
  Code,
  Heading1,
  Heading2,
  Heading3,
  Pilcrow,
  List,
  ListOrdered,
  Quote,
  Minus,
  Undo,
  Redo,
  Link2,
  Unlink,
  Eye,
  FileCode,
} from "lucide-react";

interface TipTapEditorProps {
  content: string;
  onChange: (html: string) => void;
  placeholder?: string;
}

export default function TipTapEditor({
  content,
  onChange,
  placeholder = "Write your rich cryptographic guide, formulas, or security analysis...",
}: TipTapEditorProps) {
  const [viewMode, setViewMode] = useState<"visual" | "html">("visual");
  const [htmlContent, setHtmlContent] = useState<string>(content);

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: {
          levels: [1, 2, 3],
        },
      }),
      Placeholder.configure({
        placeholder,
      }),
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: "text-[#547e5d] font-bold underline hover:text-[#080f0f] transition-colors",
        },
      }),
    ],
    content,
    editorProps: {
      attributes: {
        class:
          "prose prose-sm sm:prose-base focus:outline-none min-h-[280px] max-w-none text-[#080f0f] leading-relaxed",
      },
    },
    onUpdate: ({ editor }) => {
      const html = editor.getHTML();
      setHtmlContent(html);
      onChange(html);
    },
  });

  // Sync content when external post content updates (e.g. edit page loading)
  useEffect(() => {
    if (editor && content !== editor.getHTML()) {
      editor.commands.setContent(content);
      setHtmlContent(content);
    }
  }, [content, editor]);

  if (!editor) {
    return (
      <div className="w-full h-64 clay-well bg-white/70 rounded-2xl flex items-center justify-center text-xs text-[#6b9774]">
        Initializing TipTap Rich Text Engine...
      </div>
    );
  }

  const setLink = () => {
    const previousUrl = editor.getAttributes("link").href;
    const url = window.prompt("Enter destination URL (https://...):", previousUrl);

    if (url === null) {
      return;
    }

    if (url === "") {
      editor.chain().focus().extendMarkRange("link").unsetLink().run();
      return;
    }

    editor.chain().focus().extendMarkRange("link").setLink({ href: url }).run();
  };

  const handleHtmlSourceChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newHtml = e.target.value;
    setHtmlContent(newHtml);
    onChange(newHtml);
    if (editor) {
      editor.commands.setContent(newHtml);
    }
  };

  // Word count & read time
  const plainText = editor.getText();
  const words = plainText.trim() ? plainText.trim().split(/\s+/).length : 0;
  const chars = plainText.length;
  const estimatedReadTime = Math.max(1, Math.ceil(words / 200));

  return (
    <div className="rounded-2xl clay-card p-4 space-y-3 bg-[#fbfdfc] border border-[#86ba90]/30 shadow-sm">
      {/* TipTap Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-2 p-2 rounded-xl clay-well bg-white/90 border border-[#86ba90]/25">
        <div className="flex flex-wrap items-center gap-1">
          {/* Bold */}
          <button
            type="button"
            onClick={() => editor.chain().focus().toggleBold().run()}
            disabled={!editor.can().chain().focus().toggleBold().run()}
            className={`p-2 rounded-lg text-xs font-bold transition-all ${
              editor.isActive("bold")
                ? "bg-[#86ba90] text-white shadow-sm"
                : "text-[#080f0f] hover:bg-[#edf5ef]"
            }`}
            title="Bold (Ctrl+B)"
          >
            <Bold className="w-4 h-4" />
          </button>

          {/* Italic */}
          <button
            type="button"
            onClick={() => editor.chain().focus().toggleItalic().run()}
            disabled={!editor.can().chain().focus().toggleItalic().run()}
            className={`p-2 rounded-lg text-xs font-bold transition-all ${
              editor.isActive("italic")
                ? "bg-[#86ba90] text-white shadow-sm"
                : "text-[#080f0f] hover:bg-[#edf5ef]"
            }`}
            title="Italic (Ctrl+I)"
          >
            <Italic className="w-4 h-4" />
          </button>

          {/* Strikethrough */}
          <button
            type="button"
            onClick={() => editor.chain().focus().toggleStrike().run()}
            disabled={!editor.can().chain().focus().toggleStrike().run()}
            className={`p-2 rounded-lg text-xs font-bold transition-all ${
              editor.isActive("strike")
                ? "bg-[#86ba90] text-white shadow-sm"
                : "text-[#080f0f] hover:bg-[#edf5ef]"
            }`}
            title="Strikethrough"
          >
            <Strikethrough className="w-4 h-4" />
          </button>

          {/* Inline Code */}
          <button
            type="button"
            onClick={() => editor.chain().focus().toggleCode().run()}
            disabled={!editor.can().chain().focus().toggleCode().run()}
            className={`p-2 rounded-lg text-xs font-bold transition-all ${
              editor.isActive("code")
                ? "bg-[#86ba90] text-white shadow-sm"
                : "text-[#080f0f] hover:bg-[#edf5ef]"
            }`}
            title="Inline Code"
          >
            <Code className="w-4 h-4" />
          </button>

          <div className="h-5 w-[1px] bg-[#86ba90]/30 mx-1" />

          {/* Headings */}
          <button
            type="button"
            onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
            className={`p-2 rounded-lg text-xs font-bold transition-all ${
              editor.isActive("heading", { level: 1 })
                ? "bg-[#86ba90] text-white shadow-sm"
                : "text-[#080f0f] hover:bg-[#edf5ef]"
            }`}
            title="Heading 1"
          >
            <Heading1 className="w-4 h-4" />
          </button>

          <button
            type="button"
            onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
            className={`p-2 rounded-lg text-xs font-bold transition-all ${
              editor.isActive("heading", { level: 2 })
                ? "bg-[#86ba90] text-white shadow-sm"
                : "text-[#080f0f] hover:bg-[#edf5ef]"
            }`}
            title="Heading 2"
          >
            <Heading2 className="w-4 h-4" />
          </button>

          <button
            type="button"
            onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
            className={`p-2 rounded-lg text-xs font-bold transition-all ${
              editor.isActive("heading", { level: 3 })
                ? "bg-[#86ba90] text-white shadow-sm"
                : "text-[#080f0f] hover:bg-[#edf5ef]"
            }`}
            title="Heading 3"
          >
            <Heading3 className="w-4 h-4" />
          </button>

          <button
            type="button"
            onClick={() => editor.chain().focus().setParagraph().run()}
            className={`p-2 rounded-lg text-xs font-bold transition-all ${
              editor.isActive("paragraph")
                ? "bg-[#86ba90] text-white shadow-sm"
                : "text-[#080f0f] hover:bg-[#edf5ef]"
            }`}
            title="Normal Paragraph"
          >
            <Pilcrow className="w-4 h-4" />
          </button>

          <div className="h-5 w-[1px] bg-[#86ba90]/30 mx-1" />

          {/* Lists */}
          <button
            type="button"
            onClick={() => editor.chain().focus().toggleBulletList().run()}
            className={`p-2 rounded-lg text-xs font-bold transition-all ${
              editor.isActive("bulletList")
                ? "bg-[#86ba90] text-white shadow-sm"
                : "text-[#080f0f] hover:bg-[#edf5ef]"
            }`}
            title="Bullet List"
          >
            <List className="w-4 h-4" />
          </button>

          <button
            type="button"
            onClick={() => editor.chain().focus().toggleOrderedList().run()}
            className={`p-2 rounded-lg text-xs font-bold transition-all ${
              editor.isActive("orderedList")
                ? "bg-[#86ba90] text-white shadow-sm"
                : "text-[#080f0f] hover:bg-[#edf5ef]"
            }`}
            title="Numbered List"
          >
            <ListOrdered className="w-4 h-4" />
          </button>

          {/* Blockquote */}
          <button
            type="button"
            onClick={() => editor.chain().focus().toggleBlockquote().run()}
            className={`p-2 rounded-lg text-xs font-bold transition-all ${
              editor.isActive("blockquote")
                ? "bg-[#86ba90] text-white shadow-sm"
                : "text-[#080f0f] hover:bg-[#edf5ef]"
            }`}
            title="Blockquote"
          >
            <Quote className="w-4 h-4" />
          </button>

          {/* Code Block */}
          <button
            type="button"
            onClick={() => editor.chain().focus().toggleCodeBlock().run()}
            className={`p-2 rounded-lg text-xs font-bold transition-all ${
              editor.isActive("codeBlock")
                ? "bg-[#86ba90] text-white shadow-sm"
                : "text-[#080f0f] hover:bg-[#edf5ef]"
            }`}
            title="Code Block"
          >
            <FileCode className="w-4 h-4" />
          </button>

          {/* Divider */}
          <button
            type="button"
            onClick={() => editor.chain().focus().setHorizontalRule().run()}
            className="p-2 rounded-lg text-xs font-bold text-[#080f0f] hover:bg-[#edf5ef] transition-all"
            title="Horizontal Divider"
          >
            <Minus className="w-4 h-4" />
          </button>

          <div className="h-5 w-[1px] bg-[#86ba90]/30 mx-1" />

          {/* Link */}
          <button
            type="button"
            onClick={setLink}
            className={`p-2 rounded-lg text-xs font-bold transition-all ${
              editor.isActive("link")
                ? "bg-[#86ba90] text-white shadow-sm"
                : "text-[#080f0f] hover:bg-[#edf5ef]"
            }`}
            title="Insert / Edit Link"
          >
            <Link2 className="w-4 h-4" />
          </button>

          {editor.isActive("link") && (
            <button
              type="button"
              onClick={() => editor.chain().focus().unsetLink().run()}
              className="p-2 rounded-lg text-xs font-bold text-[#ff5e5b] hover:bg-[#ffebee] transition-all"
              title="Remove Link"
            >
              <Unlink className="w-4 h-4" />
            </button>
          )}

          <div className="h-5 w-[1px] bg-[#86ba90]/30 mx-1" />

          {/* Undo / Redo */}
          <button
            type="button"
            onClick={() => editor.chain().focus().undo().run()}
            disabled={!editor.can().chain().focus().undo().run()}
            className="p-2 rounded-lg text-xs font-bold text-[#080f0f] hover:bg-[#edf5ef] disabled:opacity-40 transition-all"
            title="Undo"
          >
            <Undo className="w-4 h-4" />
          </button>

          <button
            type="button"
            onClick={() => editor.chain().focus().redo().run()}
            disabled={!editor.can().chain().focus().redo().run()}
            className="p-2 rounded-lg text-xs font-bold text-[#080f0f] hover:bg-[#edf5ef] disabled:opacity-40 transition-all"
            title="Redo"
          >
            <Redo className="w-4 h-4" />
          </button>
        </div>

        {/* View mode toggle */}
        <div className="flex items-center gap-1.5 self-end sm:self-center">
          <button
            type="button"
            onClick={() => setViewMode(viewMode === "visual" ? "html" : "visual")}
            className="px-2.5 py-1 rounded-lg clay-btn-subtle text-[11px] font-bold text-[#080f0f] flex items-center gap-1.5"
            title="Toggle Visual Editor / Raw HTML"
          >
            <Eye className="w-3.5 h-3.5 text-[#86ba90]" />
            <span>{viewMode === "visual" ? "HTML Source" : "Visual Mode"}</span>
          </button>
        </div>
      </div>

      {/* Editor Content Area */}
      {viewMode === "visual" ? (
        <div className="clay-well bg-white p-5 rounded-2xl border border-[#86ba90]/25 min-h-[300px]">
          <EditorContent editor={editor} />
        </div>
      ) : (
        <div className="clay-well bg-[#101c18] p-4 rounded-2xl border border-[#86ba90]/30">
          <div className="text-xs font-mono text-[#86ba90] mb-2 font-bold">
            Raw HTML Source (Direct Edit):
          </div>
          <textarea
            value={htmlContent}
            onChange={handleHtmlSourceChange}
            rows={14}
            className="w-full bg-transparent text-[#98d6a3] font-mono text-xs focus:outline-none resize-y"
          />
        </div>
      )}

      {/* Editor Stats Footer */}
      <div className="flex flex-wrap items-center justify-between text-xs text-[#6b9774] pt-2 px-1">
        <div className="flex items-center gap-3">
          <span>
            Words: <strong className="text-[#080f0f]">{words}</strong>
          </span>
          <span>·</span>
          <span>
            Characters: <strong className="text-[#080f0f]">{chars}</strong>
          </span>
          <span>·</span>
          <span>
            Estimated Read: <strong className="text-[#080f0f]">{estimatedReadTime} min</strong>
          </span>
        </div>
        <div className="text-[11px] text-[#86ba90] font-semibold">
          Powered by TipTap Rich Text Engine
        </div>
      </div>
    </div>
  );
}
