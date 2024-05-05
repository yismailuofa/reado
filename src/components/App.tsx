import {
  Badge,
  Box,
  Container,
  Flex,
  Heading,
  Separator,
} from "@radix-ui/themes";
import { useLiveQuery } from "dexie-react-hooks";
import { DateTime, Duration } from "luxon";
import { useMemo, useState } from "react";
import { db, getStats, mapDBSourceToSource, sourceComparator } from "../db";
import { Status } from "../interfaces";
import { useClock } from "./Clock";
import CreateButton from "./CreateButton";
import SourceDetail from "./SourceDetail";
import SourceGrid from "./SourceGrid";

export default function App() {
  const sources = (useLiveQuery(() => db.sources.toArray(), []) || [])
    .map(mapDBSourceToSource)
    .sort(sourceComparator);
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const selectedSource = useMemo(
    () => sources.find((source) => source.id === selectedId) || null,
    [selectedId, sources]
  );
  const clock = useClock(() => {
    if (!selectedSource) return;

    db.sources.where({ id: selectedSource.id }).modify((source) => {
      const timeRead = Duration.fromObject(source.timeRead);
      source.timeRead = timeRead.plus({ seconds: 1 }).rescale().toObject();
      source.updatedAt = DateTime.now().toJSDate();
    });
  });

  const stats = useMemo(() => getStats(sources), [sources]);

  return (
    <Container size="3" pt="4">
      <Flex align="end" pb="4" mx="2">
        <CreateButton
          addSource={(source) => {
            db.sources.add(source);
          }}
        />
        <Flex gap="3" ml="auto">
          <Badge color="orange" size="2">
            Total Time Read: {stats.totalTimeRead.toHuman()}
          </Badge>
          <Badge color="cyan" size="2">
            Sources: {sources.length}
          </Badge>
          <Badge color="gray" size="2">
            Not Started: {stats.numNotStarted}
          </Badge>
          <Badge color="blue" size="2">
            In Progress: {stats.numInProgress}
          </Badge>
          <Badge color="green" size="2">
            Completed: {stats.numCompleted}
          </Badge>
        </Flex>
      </Flex>
      <Flex justify="center">
        <Separator style={{ width: "100%" }} mb="2" />
      </Flex>
      <Flex>
        <Box width="60%">
          <Heading as="h2" size="3" weight="bold" align="center">
            Knowledge Sources
          </Heading>
          <Box pt="4" style={{ overflowY: "auto", height: "510px" }}>
            <SourceGrid
              sources={sources}
              selectedId={selectedId}
              handleGridClick={(id: number) => {
                if (selectedId !== id) {
                  clock.resetClock();
                }
                setSelectedId(id);
              }}
              updateStatus={(id: number) => (status: Status) => {
                db.sources.update(id, {
                  status,
                  updatedAt: DateTime.now().toJSDate(),
                });
              }}
            />
          </Box>
        </Box>
        <Box width="40%">
          <Heading as="h2" size="3" weight="bold" align="center">
            Source Details
          </Heading>
          <Box pt="4" style={{ overflowY: "auto", height: "510px" }}>
            <SourceDetail
              source={selectedSource}
              clock={clock}
              onRemove={() => {
                if (selectedSource) {
                  db.sources.delete(selectedSource.id);
                  setSelectedId(null);
                }
              }}
            />
          </Box>
        </Box>
      </Flex>
    </Container>
  );
}
