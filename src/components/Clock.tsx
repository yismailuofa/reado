import { PauseIcon, PlayIcon } from "@radix-ui/react-icons";
import { Button, Flex, IconButton, Text } from "@radix-ui/themes";
import { Duration } from "luxon";
import { useEffect, useState } from "react";

interface ClockProps {
  onTick: () => void;
}

export default function Clock({ onTick }: ClockProps) {
  const [time, setTime] = useState(Duration.fromObject({}));
  const [isRunning, setIsRunning] = useState(false);

  useEffect(() => {
    const intervalId = setInterval(() => {
      if (isRunning) {
        setTime((prevTime) => prevTime.plus({ seconds: 1 }));
        onTick();
      }
    }, 1000);

    return () => clearInterval(intervalId);
  }, [isRunning, onTick]);

  return (
    <Flex align="center" gap="3" direction="column">
      <Text size="8" weight="light">
        {time.toFormat("hh:mm:ss")}
      </Text>
      <Flex gap="1">
        <IconButton
          size="2"
          onClick={() => {
            setIsRunning(!isRunning);
          }}
        >
          {isRunning ? <PauseIcon /> : <PlayIcon />}
        </IconButton>
        <Button
          size="2"
          onClick={() => {
            setTime(Duration.fromObject({}));
          }}
          variant="outline"
        >
          Reset
        </Button>
      </Flex>
    </Flex>
  );
}
