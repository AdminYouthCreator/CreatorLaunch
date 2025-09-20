import React, { useRef, useCallback, useEffect } from 'react';
import { 
  FiBold, 
  FiItalic, 
  FiUnderline, 
  FiLink, 
  FiImage, 
  FiList, 
  FiCode,
  FiType
} from 'react-icons/fi';

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  height?: string;
}

const RichTextEditor: React.FC<RichTextEditorProps> = ({
  value,
  onChange,
  placeholder = "Start writing your blog post...",
  height = "400px"
}) => {
  const editorRef = useRef<HTMLDivElement>(null);
  const isComposing = useRef(false);

  // Save and restore cursor position
  const saveCursorPosition = () => {
    const selection = window.getSelection();
    if (selection && selection.rangeCount > 0 && editorRef.current) {
      const range = selection.getRangeAt(0);
      const preCaretRange = range.cloneRange();
      preCaretRange.selectNodeContents(editorRef.current);
      preCaretRange.setEnd(range.endContainer, range.endOffset);
      return preCaretRange.toString().length;
    }
    return 0;
  };

  const restoreCursorPosition = (position: number) => {
    if (!editorRef.current) return;
    
    const createRange = (node: Node, pos: number): { node: Node; offset: number } => {
      if (node.nodeType === Node.TEXT_NODE) {
        const textLength = node.textContent?.length || 0;
        if (pos <= textLength) {
          return { node, offset: pos };
        }
        return { node, offset: textLength };
      }
      
      let currentPos = 0;
      for (let i = 0; i < node.childNodes.length; i++) {
        const child = node.childNodes[i];
        const childLength = child.textContent?.length || 0;
        
        if (currentPos + childLength >= pos) {
          return createRange(child, pos - currentPos);
        }
        currentPos += childLength;
      }
      
      return { node, offset: node.childNodes.length };
    };

    try {
      const { node, offset } = createRange(editorRef.current, position);
      const selection = window.getSelection();
      if (selection) {
        const range = document.createRange();
        range.setStart(node, offset);
        range.setEnd(node, offset);
        selection.removeAllRanges();
        selection.addRange(range);
      }
    } catch (error) {
      console.warn('Failed to restore cursor position:', error);
    }
  };

  // Update content only when value changes from outside
  useEffect(() => {
    if (editorRef.current && !isComposing.current) {
      const currentContent = editorRef.current.innerHTML;
      if (currentContent !== value) {
        const cursorPosition = saveCursorPosition();
        editorRef.current.innerHTML = value;
        // Restore cursor position after a brief delay to allow DOM update
        setTimeout(() => restoreCursorPosition(cursorPosition), 0);
      }
    }
  }, [value]);

  const execCommand = useCallback((command: string, value?: string) => {
    document.execCommand(command, false, value);
    if (editorRef.current) {
      onChange(editorRef.current.innerHTML);
    }
  }, [onChange]);

  const handleInput = () => {
    if (editorRef.current && !isComposing.current) {
      onChange(editorRef.current.innerHTML);
    }
  };

  const handleCompositionStart = () => {
    isComposing.current = true;
  };

  const handleCompositionEnd = () => {
    isComposing.current = false;
    if (editorRef.current) {
      onChange(editorRef.current.innerHTML);
    }
  };

  const insertHeading = (level: number) => {
    const selection = window.getSelection();
    if (selection && selection.rangeCount > 0) {
      const range = selection.getRangeAt(0);
      const selectedText = range.toString() || 'Heading';
      const headingHtml = `<h${level}>${selectedText}</h${level}>`;
      execCommand('insertHTML', headingHtml);
    }
  };

  const insertLink = () => {
    const url = prompt('Enter URL:');
    if (url) {
      execCommand('createLink', url);
    }
  };

  const insertImage = () => {
    const url = prompt('Enter image URL:');
    if (url) {
      const imgHtml = `<img src="${url}" alt="Blog image" style="max-width: 100%; height: auto; border-radius: 8px; margin: 16px 0;" />`;
      execCommand('insertHTML', imgHtml);
    }
  };

  const formatCode = () => {
    const selection = window.getSelection();
    if (selection && selection.rangeCount > 0) {
      const range = selection.getRangeAt(0);
      const selectedText = range.toString() || 'code';
      const codeHtml = `<code style="background-color: #f3f4f6; padding: 2px 4px; border-radius: 4px; font-family: monospace;">${selectedText}</code>`;
      execCommand('insertHTML', codeHtml);
    }
  };

  return (
    <div className="border border-gray-300 rounded-lg overflow-hidden">
      {/* Toolbar */}
      <div className="bg-gray-50 border-b border-gray-300 p-3 flex flex-wrap gap-2">
        {/* Text Formatting */}
        <div className="flex border-r border-gray-300 pr-3 mr-3">
          <button
            type="button"
            onClick={() => execCommand('bold')}
            className="p-2 hover:bg-gray-200 rounded"
            title="Bold"
          >
            <FiBold size={16} />
          </button>
          <button
            type="button"
            onClick={() => execCommand('italic')}
            className="p-2 hover:bg-gray-200 rounded"
            title="Italic"
          >
            <FiItalic size={16} />
          </button>
          <button
            type="button"
            onClick={() => execCommand('underline')}
            className="p-2 hover:bg-gray-200 rounded"
            title="Underline"
          >
            <FiUnderline size={16} />
          </button>
        </div>

        {/* Headings */}
        <div className="flex border-r border-gray-300 pr-3 mr-3">
          <button
            type="button"
            onClick={() => insertHeading(2)}
            className="px-3 py-2 hover:bg-gray-200 rounded text-sm font-semibold"
            title="Heading 2"
          >
            H2
          </button>
          <button
            type="button"
            onClick={() => insertHeading(3)}
            className="px-3 py-2 hover:bg-gray-200 rounded text-sm font-semibold"
            title="Heading 3"
          >
            H3
          </button>
        </div>

        {/* Lists */}
        <div className="flex border-r border-gray-300 pr-3 mr-3">
          <button
            type="button"
            onClick={() => execCommand('insertUnorderedList')}
            className="p-2 hover:bg-gray-200 rounded"
            title="Bullet List"
          >
            <FiList size={16} />
          </button>
          <button
            type="button"
            onClick={() => execCommand('insertOrderedList')}
            className="p-2 hover:bg-gray-200 rounded text-sm font-semibold"
            title="Numbered List"
          >
            1.
          </button>
        </div>

        {/* Media & Links */}
        <div className="flex">
          <button
            type="button"
            onClick={insertLink}
            className="p-2 hover:bg-gray-200 rounded"
            title="Insert Link"
          >
            <FiLink size={16} />
          </button>
          <button
            type="button"
            onClick={insertImage}
            className="p-2 hover:bg-gray-200 rounded"
            title="Insert Image"
          >
            <FiImage size={16} />
          </button>
          <button
            type="button"
            onClick={formatCode}
            className="p-2 hover:bg-gray-200 rounded"
            title="Code"
          >
            <FiCode size={16} />
          </button>
        </div>
      </div>

      {/* Editor */}
      <div
        ref={editorRef}
        contentEditable
        onInput={handleInput}
        onCompositionStart={handleCompositionStart}
        onCompositionEnd={handleCompositionEnd}
        className="p-4 focus:outline-none prose max-w-none"
        style={{ minHeight: height }}
        data-placeholder={placeholder}
        suppressContentEditableWarning={true}
      />

      <style jsx>{`
        [contenteditable]:empty:before {
          content: attr(data-placeholder);
          color: #9ca3af;
          font-style: italic;
        }
      `}</style>
    </div>
  );
};

export default RichTextEditor;
