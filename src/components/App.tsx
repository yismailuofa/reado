import { Box, Container, Flex, Heading, Separator } from "@radix-ui/themes";
import { useLiveQuery } from "dexie-react-hooks";
import { DateTime, Duration } from "luxon";
import { useMemo, useState } from "react";
import { db, mapDBSourceToSource } from "../db";
import { Status } from "../interfaces";
import { useClock } from "./Clock";
import CreateButton from "./CreateButton";
import SourceDetail from "./SourceDetail";
import SourceGrid from "./SourceGrid";

export default function App() {
  const sources = (useLiveQuery(() => db.sources.toArray(), []) || []).map(
    mapDBSourceToSource
  );
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const selectedSource = useMemo(
    () => (selectedIndex !== null ? sources[selectedIndex] : null),
    [selectedIndex, sources]
  );

  const clock = useClock(() => {
    if (!selectedSource) return;

    db.sources.where({ id: selectedSource.id }).modify((source) => {
      const timeRead = Duration.fromObject(source.timeRead);
      source.timeRead = timeRead.plus({ seconds: 1 }).rescale().toObject();
      source.updatedAt = DateTime.now().toJSDate();
    });
  });

  return (
    <Container size="3" pt="4">
      <Box p="4">
        <CreateButton
          addSource={(source) => {
            db.sources.add(source);
          }}
        />
      </Box>
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
              selectedSource={selectedSource}
              handleGridClick={(index: number) => {
                if (selectedIndex !== index) {
                  clock.resetClock();
                }
                setSelectedIndex(index);
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
                  setSelectedIndex(null);
                }
              }}
            />
          </Box>
        </Box>
      </Flex>
    </Container>
  );
}
