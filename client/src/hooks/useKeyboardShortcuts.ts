import { useEffect } from 'react';

export interface KeyboardShortcut {
  key: string;
  ctrl?: boolean;
  shift?: boolean;
  alt?: boolean;
  meta?: boolean;
  handler: (event: KeyboardEvent) => void;
  description: string;
}

export function useKeyboardShortcuts(shortcuts: KeyboardShortcut[], enabled = true) {
  useEffect(() => {
    if (!enabled) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      for (const shortcut of shortcuts) {
        const keyMatches = event.key.toLowerCase() === shortcut.key.toLowerCase();
        const ctrlMatches = shortcut.ctrl ? event.ctrlKey || event.metaKey : !event.ctrlKey && !event.metaKey;
        const shiftMatches = shortcut.shift ? event.shiftKey : !event.shiftKey;
        const altMatches = shortcut.alt ? event.altKey : !event.altKey;

        if (keyMatches && ctrlMatches && shiftMatches && altMatches) {
          event.preventDefault();
          shortcut.handler(event);
          break;
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [shortcuts, enabled]);
}

export const KEYBOARD_SHORTCUTS_HELP = {
  assessment: [
    { key: '1-7', description: 'Select rating for current question' },
    { key: 'N or J', description: 'Next question' },
    { key: 'P or K', description: 'Previous question' },
    { key: 'Ctrl+Enter', description: 'Submit assessment' },
    { key: 'Ctrl+Shift+R', description: 'Jump to Results button' },
    { key: '?', description: 'Show keyboard shortcuts' },
    { key: 'Esc', description: 'Close dialogs' },
  ],
  form: [
    { key: 'Tab', description: 'Move to next field' },
    { key: 'Shift+Tab', description: 'Move to previous field' },
    { key: 'Arrow Keys', description: 'Navigate radio buttons' },
    { key: 'Enter', description: 'Submit form' },
  ],
};
