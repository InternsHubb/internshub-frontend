import { useEffect, useRef } from 'react';
import type { ReactNode, SyntheticEvent } from 'react';

// Turns off ordinary copy, cut, paste, drag and the context menu inside the active interview's
// question and answer area only. It is a deterrent, not a security boundary: screenshots, a phone
// camera, extensions, AI browser assistants and developer tools can all still read the page.
//
// Keyboard use is untouched — shortcuts are stopped at the clipboard event, not by blocking keys —
// and screen readers read the text as usual. Text fields keep typing, selection and the browser's
// context menu (spell-check, input methods); only clipboard and drop into them are stopped.

function isEditable(target: EventTarget | null): boolean {
  return target instanceof HTMLElement && (target.isContentEditable || target.closest('input, textarea, select') !== null);
}

const prevent = (event: SyntheticEvent) => event.preventDefault();

export function CopyGuard({ children, className = '' }: { children: ReactNode; className?: string }) {
  const region = useRef<HTMLDivElement>(null);

  // Listen on the document as well, so a selection that starts outside and runs into the region
  // (for example Ctrl+A) can't be copied either.
  useEffect(() => {
    const node = region.current;
    if (!node) return;
    const touchesRegion = (event: ClipboardEvent) => {
      if (event.target instanceof Node && node.contains(event.target)) return true;
      const selection = document.getSelection();
      if (!selection || selection.rangeCount === 0 || selection.isCollapsed) return false;
      return selection.getRangeAt(0).intersectsNode(node);
    };
    const onClipboard = (event: ClipboardEvent) => {
      if (touchesRegion(event)) event.preventDefault();
    };
    document.addEventListener('copy', onClipboard);
    document.addEventListener('cut', onClipboard);
    return () => {
      document.removeEventListener('copy', onClipboard);
      document.removeEventListener('cut', onClipboard);
    };
  }, []);

  return (
    <div
      ref={region}
      onPaste={prevent}
      onDrop={prevent}
      onDragStart={prevent}
      onContextMenu={(event) => {
        if (!isEditable(event.target)) event.preventDefault();
      }}
      className={`select-none [&_input]:select-text [&_textarea]:select-text [&_[contenteditable=true]]:select-text ${className}`}
    >
      {children}
    </div>
  );
}
