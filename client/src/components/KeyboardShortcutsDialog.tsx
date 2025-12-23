import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { KEYBOARD_SHORTCUTS_HELP } from "@/hooks/useKeyboardShortcuts";

interface KeyboardShortcutsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  context: 'assessment' | 'form';
}

export function KeyboardShortcutsDialog({ open, onOpenChange, context }: KeyboardShortcutsDialogProps) {
  const shortcuts = KEYBOARD_SHORTCUTS_HELP[context];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Keyboard Shortcuts</DialogTitle>
        </DialogHeader>
        <div className="space-y-3">
          {shortcuts.map((shortcut, index) => (
            <div key={index} className="flex items-center justify-between py-2 border-b border-border last:border-0">
              <span className="text-sm text-muted-foreground">{shortcut.description}</span>
              <kbd className="px-2 py-1 text-xs font-semibold text-foreground bg-muted border border-border rounded">
                {shortcut.key}
              </kbd>
            </div>
          ))}
        </div>
        <p className="text-xs text-muted-foreground mt-4">
          Press <kbd className="px-1 py-0.5 text-xs bg-muted border border-border rounded">Esc</kbd> to close this dialog
        </p>
      </DialogContent>
    </Dialog>
  );
}
