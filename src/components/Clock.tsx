import { Button, Flex, Text } from "@radix-ui/themes";
import { useEffect, useState } from "react";

export default function Clock() {
  const [time, setTime] = useState(
    new Date().toLocaleTimeString().slice(0, -3)
  );

  useEffect(() => {
    const intervalId = setInterval(() => {
      setTime(new Date().toLocaleTimeString().slice(0, -3));
    }, 1000);

    return () => clearInterval(intervalId);
  }, []);

  return (
    <Flex align="center" gap="3" direction="column">
      <Text size="6" weight="light">
        {time}
      </Text>
      <Flex gap="1">
        <Button size="1">Start</Button>
        <Button size="1" variant="outline">
          Stop
        </Button>
      </Flex>
    </Flex>
  );
}
