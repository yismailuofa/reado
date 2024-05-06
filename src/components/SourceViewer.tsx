import { Dialog } from "@radix-ui/themes";
import { Source } from "../interfaces";

interface SourceViewerProps {
  source: Source;
  onOpenChange: (open: boolean) => void;
}

export default function SourceViewer({ onOpenChange }: SourceViewerProps) {
  return (
    <Dialog.Root onOpenChange={onOpenChange} open>
      <Dialog.Content>Hello!</Dialog.Content>
    </Dialog.Root>
  );
}
