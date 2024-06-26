import {
  Badge,
  Box,
  Container,
  Flex,
  Heading,
  Separator,
  Tooltip,
} from "@radix-ui/themes";
import { useMemo } from "react";
import {
  sourcesSelector,
  storeSourceToSource,
} from "../features/sources/sourcesSlice";
import { useAppSelector } from "../store";
import { getStats, humanizeDuration } from "../util";
import CreateButton from "./CreateButton";
import SourceGrid from "./SourceGrid";

export default function App() {
  const sources = useAppSelector(sourcesSelector).map(storeSourceToSource);
  const stats = useMemo(() => getStats(sources), [sources]);

  return (
    <Container size="3" pt="4">
      <Flex align="end" pb="4" mx="2">
        <CreateButton />
        <Flex gap="3" ml="auto">
          <Tooltip content={stats.totalTimeRead.toHuman()}>
            <Badge color="orange" size="2">
              Total Time Read: {humanizeDuration(stats.totalTimeRead, {})}
            </Badge>
          </Tooltip>
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
      <Separator style={{ width: "100%" }} mb="2" />
      <Flex direction="column" align="center">
        <Box>
          <Heading as="h2" size="3" weight="bold" align="center">
            Knowledge Sources
          </Heading>
          <Box pt="2" style={{ height: "510px" }}>
            <SourceGrid />
          </Box>
        </Box>
      </Flex>
    </Container>
  );
}
