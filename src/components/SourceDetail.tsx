import { ArrowTopRightIcon, TrashIcon } from "@radix-ui/react-icons";
import {
  Button,
  Card,
  Flex,
  IconButton,
  Separator,
  Text,
  Tooltip,
} from "@radix-ui/themes";
import { Duration } from "luxon";
import { Source } from "../interfaces";
import Clock, { UseClockResult } from "./Clock";

function humanizeDuration(duration: Duration): [number, string] {
  let num = 0;
  let unit = "";

  if (duration.as("hours") >= 1) {
    num = Math.floor(duration.as("hours"));
    unit = "hour";
  } else if (duration.as("minutes") >= 1) {
    num = Math.floor(duration.as("minutes"));
    unit = "minute";
  } else {
    num = Math.floor(duration.as("seconds"));
    unit = "second";
  }

  return [num, unit + (num === 1 ? "" : "s")];
}

interface SourceDetailProps {
  source: Source | null;
  onRemove: () => void;
  clock: UseClockResult;
}

export default function SourceDetail({
  source,
  onRemove,
  clock,
}: SourceDetailProps) {
  if (!source) {
    return (
      <Card style={{ height: "100%" }}>
        <Flex
          direction="column"
          align="center"
          gap="3"
          height="100%"
          justify="center"
        >
          <Text size="4"> No source selected </Text>
        </Flex>
      </Card>
    );
  }

  const [timeReadNum, timeReadUnit] = humanizeDuration(source.timeRead);

  return (
    <Card style={{ height: "100%" }}>
      <Flex direction="column" gap="3" height="100%">
        <Text as="div" size="2" weight="medium">
          {source.title}
        </Text>
        <Separator style={{ width: "100%" }} />
        <Flex gap="3">
          <Flex
            style={{
              width: "50%",
              backgroundColor: "var(--accent-a3)",
              aspectRatio: "1",
              borderRadius: "var(--radius-5 )",
            }}
            align="center"
            justify="center"
            direction="column"
          >
            <Clock {...clock} />
          </Flex>
          <Flex
            style={{
              width: "50%",
              backgroundColor: "var(--indigo-a3)",
              aspectRatio: "1",
              borderRadius: "var(--radius-5 )",
            }}
            p="2"
            align="center"
            direction="column"
          >
            <Text color="indigo" size="5" style={{ height: "20%" }}>
              Time Read
            </Text>
            <Tooltip content={source.timeRead.toHuman()} delayDuration={1200}>
              <Flex
                style={{
                  borderRadius: "50%",
                  height: "80%",
                  aspectRatio: "1",
                  border: "2.5px solid var(--indigo-11)",
                }}
                m="0"
                justify="center"
              >
                <Flex direction="column" align="center" justify="center">
                  <Text size="8" align="center" weight="bold" color="indigo">
                    {timeReadNum}
                  </Text>
                  <Text size="4" align="center" weight="medium" color="indigo">
                    {timeReadUnit}
                  </Text>
                </Flex>
              </Flex>
            </Tooltip>
          </Flex>
        </Flex>
        <Flex justify="between" mt="auto">
          <Button asChild>
            <a
              href={source.url}
              target="_blank"
              rel="noreferrer"
              onClick={() => clock.setIsRunning(true)}
            >
              Open Link
              <ArrowTopRightIcon />
            </a>
          </Button>
          <IconButton color="red" variant="solid" onClick={onRemove}>
            <TrashIcon />
          </IconButton>
        </Flex>
      </Flex>
    </Card>
  );
}
