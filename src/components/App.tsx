import { Box, Container, Flex, Heading, Separator } from "@radix-ui/themes";
import { DateTime, Duration } from "luxon";
import { useCallback, useState } from "react";
import { Source, SourceType, Status } from "../interfaces";
import { useClock } from "./Clock";
import CreateButton from "./CreateButton";
import SourceDetail from "./SourceDetail";
import SourceGrid from "./SourceGrid";

export default function App() {
  const [sources, setSources] = useState<Source[]>([
    {
      id: "1",
      timeRead: Duration.fromObject({ hours: 3, minutes: 300, seconds: 20 }),
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
      timeRead: Duration.fromObject({ seconds: 30 }),
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

  const onTick = useCallback(() => {
    if (selectedSourceIndex === null) return;
    const newSources = [...sources];
    newSources[selectedSourceIndex].timeRead = newSources[
      selectedSourceIndex
    ].timeRead.plus({ seconds: 1 });
    setSources(newSources);
  }, [selectedSourceIndex, sources]);

  const clock = useClock(onTick);

  const handleGridClick = useCallback(
    (index: number) => {
      setSelectedSourceIndex(index);
      if (selectedSourceIndex !== index) {
        clock.resetClock();
      }
    },
    [clock, selectedSourceIndex]
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
              handleGridClick={handleGridClick}
              updateStatus={(index: number) => (status: Status) => {
                const newSources = [...sources];
                newSources[index].status = status;
                setSources(newSources);
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
              source={
                selectedSourceIndex !== null
                  ? sources[selectedSourceIndex]
                  : null
              }
              clock={clock}
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
