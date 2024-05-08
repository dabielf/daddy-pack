"use client";

import { Toggle } from "@/components/ui/toggle";
import { type Editor } from "@tiptap/react";
import { Bold, Italic } from "lucide-react";

type Props = {
  editor: Editor | null;
};

export function Toolbar({ editor }: Props) {
  if (!editor) return null;
  return (
    <div className="rounded-md border border-input bg-card">
      <Toggle
        size="sm"
        className="rounded-sm"
        pressed={editor.isActive("bold")}
        onPressedChange={() => editor.chain().focus().toggleBold().run()}
      >
        <Bold className="h-4 w-4" />
      </Toggle>
      <Toggle
        size="sm"
        className="rounded-sm"
        pressed={editor.isActive("italic")}
        onPressedChange={() => editor.chain().focus().toggleItalic().run()}
      >
        <Italic className="h-4 w-4" />
      </Toggle>
    </div>
  );
}
