'use client';

import { EditorContent, useEditor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import { Markdown } from 'tiptap-markdown';
import { Toolbar } from './tiptapEditor';

const Tiptap = ({
  content,
  onChange,
}: {
  content?: string;
  onChange: (richText: string) => void;
}) => {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        dropcursor: {
          class: 'bg-primary',
        },
      }),
      Markdown,
    ],
    editorProps: {
      attributes: {
        class:
          'min-h-[100px] w-full rounded-md border border-input bg-white px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50',
      },
    },
    onUpdate: ({ editor }) => {
      onChange(editor.storage.markdown.getMarkdown());
    },
  });

  if (editor && !editor.storage.markdown.getMarkdown()) {
    if (!content) {
      editor.commands.setContent('');
      return;
    }
    editor.commands.setContent(content);
  }

  return (
    <div>
      <Toolbar editor={editor} />
      <EditorContent editor={editor} />
    </div>
  );
};

export default Tiptap;
