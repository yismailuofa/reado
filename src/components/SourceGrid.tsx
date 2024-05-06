import { InfoCircledIcon } from "@radix-ui/react-icons";
import { Callout, Flex } from "@radix-ui/themes";
import { useState } from "react";
import {
  dbSourceToSource,
  sourcesSelector,
} from "../features/sources/sourcesSlice";
import { Source } from "../interfaces";
import { useAppSelector } from "../store";
import SourceRow from "./SourceRow";
import SourceViewer from "./SourceViewer";

export default function SourceGrid() {
  const sources = useAppSelector(sourcesSelector).map(dbSourceToSource);
  const [selectedSource, setSelectedSource] = useState<Source | null>(null);

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
    <Flex gap="4" direction="column" align="center">
      {sources.map((source) => (
        <SourceRow
          key={source.id}
          source={source}
          onClick={() => setSelectedSource(source)}
        />
      ))}
      {selectedSource && (
        <SourceViewer
          source={selectedSource}
          onOpenChange={() => setSelectedSource(null)}
        />
      )}
    </Flex>
  );
}
