import { Box, Container, Flex, Heading, Separator } from "@radix-ui/themes";
import { DateTime, Duration } from "luxon";
import { useState } from "react";
import { Source, SourceType, Status } from "../interfaces";
import CreateButton from "./CreateButton";
import SourceDetail from "./SourceDetail";
import SourceGrid from "./SourceGrid";

export default function App() {
  const [sources, setSources] = useState<Source[]>([
    {
      id: "1",
      timeRead: Duration.fromObject({}),
      title: "Designing Data-Intensive Applications",
      type: SourceType.Book,
      url: "https://www.amazon.com/Designing-Data-Intensive-Applications-Reliable-Maintainable/dp/1449373321",
      authors: "Martin Kleppmann",
      createdAt: DateTime.now(),
      updatedAt: DateTime.now(),
      status: Status.NotStarted,
    },
    {
      id: "2",
      timeRead: Duration.fromObject({ minutes: 30 }),
      title: "Coding Adventures",
      type: SourceType.Video,
      url: "https://www.youtube.com/playlist?list=PLFt_AvWsXl0ehjAfLFsp1PGaatzAwo0uK",
      authors: "Sebastian Lague",
      createdAt: DateTime.now(),
      updatedAt: DateTime.now(),
      status: Status.InProgress,
    },
    {
      id: "3",
      timeRead: Duration.fromObject({ hours: 1 }),
      title: "Foo Bar",
      type: SourceType.Video,
      url: "https://www.youtube.com/playlist?list=PLFt_AvWsXl0ehjAfLFsp1PGaatzAwo0uK",
      authors: "Sebastian Lague",
      createdAt: DateTime.now(),
      updatedAt: DateTime.now(),
      status: Status.Completed,
    },
  ]);
  const [selectedSourceIndex, setSelectedSourceIndex] = useState<number | null>(
    null
  );

  return (
    <Container size="3" pt="4">
      <Box p="4">
        <CreateButton
          addSource={(source: Source) => setSources([...sources, source])}
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
              selectedSourceIndex={selectedSourceIndex}
              setSelectedSourceIndex={setSelectedSourceIndex}
            />
          </Box>
        </Box>
        <Box width="40%">
          <Heading as="h2" size="3" weight="bold" align="center">
            Source Details
          </Heading>
          <Box pt="4" style={{ overflowY: "auto", height: "510px" }}>
            <SourceDetail
              source={
                selectedSourceIndex !== null
                  ? sources[selectedSourceIndex]
                  : null
              }
              setSource={(source: Source) => {
                const newSources = [...sources];
                newSources[selectedSourceIndex as number] = source;
                setSources(newSources);
              }}
              onRemove={() => {
                if (selectedSourceIndex === null) return;
                const newSources = [...sources];
                newSources.splice(selectedSourceIndex, 1);
                setSources(newSources);
                setSelectedSourceIndex(null);
              }}
            />
          </Box>
        </Box>
      </Flex>
    </Container>
  );
}
