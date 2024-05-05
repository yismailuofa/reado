import { PauseIcon, PlayIcon } from "@radix-ui/react-icons";
import { Button, Flex, IconButton, Text } from "@radix-ui/themes";
import { Duration } from "luxon";
import { useEffect, useState } from "react";

export interface UseClockResult {
  time: Duration<true>;
  isRunning: boolean;
  setIsRunning: React.Dispatch<React.SetStateAction<boolean>>;
  resetClock: () => void;
}

export const useClock = (onTick: () => void): UseClockResult => {
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
  }, [isRunning]);

  const resetClock = () => {
    setTime(Duration.fromObject({}));
    setIsRunning(false);
    window.document.title = "reado";
  };

  useEffect(() => {
    if (isRunning) {
      document.title = `reado - ${time.toFormat("hh:mm:ss")}`;
    }
  }, [isRunning, time]);

  return { time, isRunning, setIsRunning, resetClock };
};

interface ClockProps {
  time: Duration;
  isRunning: boolean;
  setIsRunning: (isRunning: boolean) => void;
  resetClock: () => void;
}

export default function Clock({
  time,
  isRunning,
  setIsRunning,
  resetClock,
}: ClockProps) {
  return (
    <Flex align="center" gap="3" direction="column">
      <Text size="8" weight="light" color="bronze">
        {time.toFormat("hh:mm:ss")}
      </Text>
      <Flex gap="2">
        <IconButton
          size="2"
          onClick={() => {
            setIsRunning(!isRunning);
          }}
        >
          {isRunning ? <PauseIcon /> : <PlayIcon />}
        </IconButton>
        <Button size="2" onClick={resetClock} variant="outline">
          Reset
        </Button>
      </Flex>
    </Flex>
  );
}
