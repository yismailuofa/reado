import { PauseIcon, PlayIcon } from "@radix-ui/react-icons";
import { Badge, Flex, IconButton } from "@radix-ui/themes";
import { Duration } from "luxon";
import { useEffect, useState } from "react";
import { incrementTimeRead } from "../features/sources/sourcesSlice";
import { useAppDispatch } from "../store";

export default function Clock({ id }: { id: number }) {
  const dispatch = useAppDispatch();
  const [time, setTime] = useState(Duration.fromObject({ seconds: 0 }));
  const [isRunning, setIsRunning] = useState(true);

  useEffect(() => {
    const interval = setInterval(() => {
      if (isRunning) {
        setTime((time) => time.plus({ seconds: 1 }));
        dispatch(incrementTimeRead({ id }));
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [isRunning, dispatch, id]);

  return (
    <Flex align="center" gap="3" direction="column">
      <Flex gap="2">
        <Badge variant="soft" size="2" style={{ width: "170px" }}>
          Current Session: {time.toFormat("hh:mm:ss")}
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
