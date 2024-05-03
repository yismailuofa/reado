import { ArrowTopRightIcon, TrashIcon } from "@radix-ui/react-icons";
import {
  Badge,
  Box,
  Button,
  Card,
  Flex,
  IconButton,
  Select,
  Separator,
  Text,
} from "@radix-ui/themes";
import { useCallback } from "react";
import { Source, Status } from "../interfaces";
import Clock from "./Clock";
import { statusToBadgeColor } from "./SourceRow";

interface SourceDetailProps {
  source: Source | null;
  setSource: (source: Source) => void;
  onRemove: () => void;
}

export default function SourceDetail({
  source,
  setSource,
  onRemove,
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

  const onTick = useCallback(() => {
    setSource({
      ...source,
      timeRead: source.timeRead.plus({ seconds: 1 }),
    });
  }, [source, setSource]);

  return (
    <Card style={{ height: "100%" }}>
      <Flex direction="column" gap="3" height="100%">
        <Text as="div" size="2" weight="medium">
          {source.title}
        </Text>
        <Separator style={{ width: "100%" }} />
        <Button asChild>
          <a href={source.url} target="_blank" rel="noreferrer">
            Open
            <ArrowTopRightIcon />
          </a>
        </Button>
        <Badge color="indigo" size="3">
          Time Read: {source.timeRead.toHuman({}) || "0 seconds"}
        </Badge>
        <Flex direction="row" gap="3" align="center">
          <Text weight="bold" size="1" style={{ width: "20%" }}>
            STATUS
          </Text>
          <Box>
            <Select.Root
              value={source.status}
              onValueChange={(value) =>
                setSource({ ...source, status: value as Status })
              }
              size="2"
            >
              <Select.Trigger variant="ghost" color="gray">
                <Badge color={statusToBadgeColor(source.status)}>
                  {source.status}
                </Badge>
              </Select.Trigger>
              <Select.Content>
                {Object.values(Status).map((type) => (
                  <Select.Item key={type} value={type}>
                    {type}
                  </Select.Item>
                ))}
              </Select.Content>
            </Select.Root>
          </Box>
        </Flex>
        <Clock onTick={onTick} />
        <Flex justify="end" mt="auto">
          <IconButton color="red" variant="solid" onClick={onRemove}>
            <TrashIcon />
          </IconButton>
        </Flex>
      </Flex>
    </Card>
  );
}
