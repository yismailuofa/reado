import { InfoCircledIcon } from "@radix-ui/react-icons";
import { Callout, Flex, ScrollArea } from "@radix-ui/themes";
import { Worker } from "@react-pdf-viewer/core";
import { useState } from "react";
import {
  sourcesSelector,
  storeSourceToSource,
} from "../features/sources/sourcesSlice";
import { useAppSelector } from "../store";
import { sourceComparator } from "../util";
import SourceRow from "./SourceRow";
import SourceViewer from "./SourceViewer";

export default function SourceGrid() {
  const sources = useAppSelector(sourcesSelector)
    .map(storeSourceToSource)
    .sort(sourceComparator);
  const [selectedSourceId, setSelectedSourceId] = useState<number | null>(null);

  if (!sources.length) {
    return (
      <Callout.Root variant="outline">
        <Callout.Icon>
          <InfoCircledIcon />
        </Callout.Icon>
        <Callout.Text>
          No sources found. Add a new source by clicking the button above.
        </Callout.Text>
      </Callout.Root>
    );
  }

  return (
    <ScrollArea type="auto" scrollbars="vertical">
      <Flex gap="4" direction="column" align="center" pr="4">
        {sources.map((source) => (
          <SourceRow
            key={source.id}
            source={source}
            onClick={() => setSelectedSourceId(source.id)}
          />
        ))}
        <Worker workerUrl="https://unpkg.com/pdfjs-dist@3.4.120/build/pdf.worker.min.js">
          {selectedSourceId !== null && (
            <SourceViewer
              sourceId={selectedSourceId}
              onOpenChange={() => setSelectedSourceId(null)}
            />
          )}
        </Worker>
      </Flex>
    </ScrollArea>
  );
}
