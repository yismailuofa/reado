import { InfoCircledIcon } from "@radix-ui/react-icons";
import { Callout, Flex, ScrollArea, TextField } from "@radix-ui/themes";
import { Worker } from "@react-pdf-viewer/core";
import { matchSorter } from "match-sorter";
import { useState } from "react";
import {
  sourcesSelector,
  storeSourceToSource,
  updateSourceStatus,
} from "../features/sources/sourcesSlice";
import { Status } from "../interfaces";
import { useAppDispatch, useAppSelector } from "../store";
import { sourceComparator } from "../util";
import SourceRow from "./SourceRow";
import SourceViewer from "./SourceViewer";

export default function SourceGrid() {
  const [search, setSearch] = useState("");
  const [selectedSourceId, setSelectedSourceId] = useState<number | null>(null);
  const sources = matchSorter(
    useAppSelector(sourcesSelector)
      .map(storeSourceToSource)
      .sort(sourceComparator),
    search,
    { keys: ["title", "authors"] }
  );
  const dispatch = useAppDispatch();

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
    <>
      <Flex justify="center" mb="3">
        <TextField.Root
          placeholder="Search sources"
          style={{ width: "75%" }}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </Flex>
      <ScrollArea type="auto" scrollbars="vertical">
        <Flex gap="4" direction="column" align="center" pr="4">
          {sources.map((source) => (
            <SourceRow
              key={source.id}
              source={source}
              onClick={() => {
                setSelectedSourceId(source.id);
                if (source.status == Status.NotStarted) {
                  dispatch(
                    updateSourceStatus({
                      id: source.id,
                      status: Status.InProgress,
                    })
                  );
                }
              }}
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
    </>
  );
}
