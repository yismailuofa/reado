import { ArrowTopRightIcon, TrashIcon } from "@radix-ui/react-icons";
import {
  Avatar,
  Badge,
  Box,
  Button,
  Card,
  Flex,
  IconButton,
  Popover,
  Select,
  Text,
  Tooltip,
} from "@radix-ui/themes";
import {
  removeSource,
  updateSourceStatus,
} from "../features/sources/sourcesSlice";
import { Source, Status } from "../interfaces";
import { useAppDispatch } from "../store";
import { sourceTypeToIcon, statusToBadgeColor } from "../util";

interface SourceRowProps {
  source: Source;
  onClick: () => void;
}

export default function SourceRow({ source, onClick }: SourceRowProps) {
  const dispatch = useAppDispatch();

  return (
    <Box width="500px">
      <Card size="1" className="source-row">
        <Flex gap="3" align="center">
          <Avatar
            size="3"
            radius="full"
            fallback={sourceTypeToIcon(source.type)}
            variant="solid"
          />
          <Box>
            <Tooltip content={source.title} delayDuration={900}>
              <Text as="div" size="2" weight="bold" className="line-overflow">
                {source.title}
              </Text>
            </Tooltip>
            <Tooltip content={source.authors} delayDuration={900}>
              <Text as="div" size="2" color="gray" className="line-overflow">
                {source.authors}
              </Text>
            </Tooltip>
          </Box>
          <Flex ml="auto" direction="column" gap="2" align="end">
            <Badge variant="solid">{source.type}</Badge>
            <Select.Root
              value={source.status}
              onValueChange={(value) =>
                dispatch(
                  updateSourceStatus({ id: source.id, status: value as Status })
                )
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
          </Flex>
        </Flex>
        <Flex justify="between" pt="3" align="center">
          <Button size="1" onClick={onClick}>
            Open
            <ArrowTopRightIcon />
          </Button>
          <Popover.Root>
            <Popover.Trigger>
              <IconButton color="red" variant="solid" size="1">
                <TrashIcon />
              </IconButton>
            </Popover.Trigger>
            <Popover.Content>
              <Flex gap="2" direction="column">
                <Text size="2">
                  Are you sure you want to delete this source?
                </Text>
                <Popover.Close>
                  <Button
                    color="red"
                    size="1"
                    ml="auto"
                    onClick={() => {
                      dispatch(removeSource(source.id));
                    }}
                  >
                    Confirm
                  </Button>
                </Popover.Close>
              </Flex>
            </Popover.Content>
          </Popover.Root>
        </Flex>
      </Card>
    </Box>
  );
}
