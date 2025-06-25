// TipTapEditor.jsx
import React from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";

const TipTapEditor = ({ content, onUpdate }) => {
  const editor = useEditor({
    extensions: [StarterKit],
    content,
    editorProps: {
      attributes: {
        class:
          "prose min-h-[200px] max-h-[400px] overflow-auto p-2 outline-none",
      },
    },
    onUpdate: ({ editor }) => {
      onUpdate(editor.getHTML());
    },
  });

  return (
    <div className="border border-gray-300 rounded-md bg-white">
      <EditorContent editor={editor} />
    </div>
  );
};

export default TipTapEditor;
