
import { useState } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Bold, Italic, List, Image, Link } from "lucide-react";

interface RichTextEditorProps {
  initialContent: string;
  onChange: (content: string) => void;
  placeholder?: string;
}

const RichTextEditor = ({ initialContent, onChange, placeholder }: RichTextEditorProps) => {
  const [content, setContent] = useState(initialContent);
  const [selectedText, setSelectedText] = useState<{ start: number; end: number } | null>(null);
  
  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setContent(e.target.value);
    onChange(e.target.value);
  };

  const insertMarkdown = (prefix: string, suffix: string = "") => {
    const textarea = document.querySelector("textarea");
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    setSelectedText({ start, end });

    const beforeText = content.substring(0, start);
    const selectedContent = content.substring(start, end);
    const afterText = content.substring(end);

    const newContent = beforeText + prefix + selectedContent + suffix + afterText;
    setContent(newContent);
    onChange(newContent);

    // Set cursor position after update
    setTimeout(() => {
      textarea.focus();
      const newPosition = start + prefix.length + selectedContent.length + suffix.length;
      textarea.setSelectionRange(newPosition, newPosition);
    }, 0);
  };

  const handleBold = () => insertMarkdown('**', '**');
  const handleItalic = () => insertMarkdown('*', '*');
  const handleList = () => insertMarkdown('\n- ');
  const handleLink = () => insertMarkdown('[', '](url)');
  const handleImage = () => insertMarkdown('![alt text](', ')');

  return (
    <div className="border rounded-md">
      <div className="flex items-center gap-2 border-b p-2 bg-muted/20">
        <Button 
          type="button" 
          variant="ghost" 
          size="sm" 
          onClick={handleBold} 
          className="h-8 w-8 p-0"
        >
          <Bold size={16} />
        </Button>
        <Button 
          type="button" 
          variant="ghost" 
          size="sm" 
          onClick={handleItalic}
          className="h-8 w-8 p-0"
        >
          <Italic size={16} />
        </Button>
        <Button 
          type="button" 
          variant="ghost" 
          size="sm" 
          onClick={handleList}
          className="h-8 w-8 p-0"
        >
          <List size={16} />
        </Button>
        <Button 
          type="button" 
          variant="ghost" 
          size="sm" 
          onClick={handleLink}
          className="h-8 w-8 p-0"
        >
          <Link size={16} />
        </Button>
        <Button 
          type="button" 
          variant="ghost" 
          size="sm" 
          onClick={handleImage}
          className="h-8 w-8 p-0"
        >
          <Image size={16} />
        </Button>
      </div>
      <Textarea 
        value={content} 
        onChange={handleChange} 
        className="min-h-[200px] border-0 rounded-t-none"
        placeholder={placeholder}
      />
    </div>
  );
};

export default RichTextEditor;
