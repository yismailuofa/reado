import { PauseIcon, PlayIcon } from "@radix-ui/react-icons";
import { Badge, Flex, IconButton } from "@radix-ui/themes";
import { Duration } from "luxon";
import { useEffect, useState } from "react";

export default function Clock() {
  const [time, setTime] = useState(Duration.fromObject({ seconds: 0 }));
  const [isRunning, setIsRunning] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      if (isRunning) {
        setTime((time) => time.plus({ seconds: 1 }));
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [isRunning]);

  return (
    <Flex align="center" gap="3" direction="column">
      <Flex gap="2">
        <Badge
          variant="soft"
          size="2"
          style={{
            width: "110px",
          }}
        >
          Timer: {time.toFormat("hh:mm:ss")}
        </Badge>
        <IconButton
          size="1"
          onClick={() => {
            setIsRunning(!isRunning);
          }}
        >
          {isRunning ? <PauseIcon /> : <PlayIcon />}
        </IconButton>
      </Flex>
    </Flex>
  );
}
