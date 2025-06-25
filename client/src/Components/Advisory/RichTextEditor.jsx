import React from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";

const RichTextEditor = ({ content, onChange }) => {
  const editor = useEditor({
    extensions: [StarterKit],
    content,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
    editorProps: {
      attributes: {
        class: "min-h-[150px] p-2 outline-none prose",
      },
    },
  });

  return (
    <div className="border rounded bg-white">
      <EditorContent editor={editor} />
    </div>
  );
};

export default RichTextEditor;
