import { ArrowTopRightIcon, TrashIcon } from "@radix-ui/react-icons";
import {
  Badge,
  Button,
  Card,
  Dialog,
  Flex,
  IconButton,
  Separator,
  Text,
  Tooltip,
} from "@radix-ui/themes";
import { Duration } from "luxon";
import { useState } from "react";
import { pdfjs } from "react-pdf";
import { Source } from "../interfaces";
import Clock, { UseClockResult } from "./Clock";

// Set the worker source for pdfjs
pdfjs.GlobalWorkerOptions.workerSrc = new URL(
  "pdfjs-dist/build/pdf.worker.min.js",
  import.meta.url
).toString();

import "react-pdf/dist/Page/AnnotationLayer.css";
import "react-pdf/dist/Page/TextLayer.css";

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
  const [showFile, setShowFile] = useState(false);
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
          <Button
            onClick={() => {
              const hasFile = source.file !== null;

              if (!hasFile) {
                window.open(source.url);
              } else {
                setShowFile(true);
              }

              clock.setIsRunning(true);
            }}
          >
            Open Link
            <ArrowTopRightIcon />
          </Button>

          <IconButton color="red" variant="solid" onClick={onRemove}>
            <TrashIcon />
          </IconButton>
        </Flex>
      </Flex>
      <Dialog.Root open={showFile} onOpenChange={() => setShowFile(false)}>
        <Dialog.Content>
          <Dialog.Title weight="light">
            <Text as="div" weight="bold" className="line-overflow">
              {source.title}
            </Text>
            <Flex gap="3" align="center" py="2">
              <Badge variant="soft">
                Timer: {clock.time.toFormat("hh:mm:ss")}
              </Badge>
              <Badge variant="soft" color="indigo">
                Time Read: {timeReadNum} {timeReadUnit}
              </Badge>
            </Flex>
            <Separator style={{ width: "100%" }} />
          </Dialog.Title>
        </Dialog.Content>
      </Dialog.Root>
    </Card>
  );
}
