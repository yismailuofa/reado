import { Link2Icon, VideoIcon } from "@radix-ui/react-icons";
import {
  Avatar,
  Badge,
  Box,
  Card,
  Flex,
  Select,
  Text,
  Tooltip,
} from "@radix-ui/themes";
import { Source, SourceType, Status } from "../interfaces";

interface SourceRowProps {
  source: Source;
  onClick: () => void;
  isSelected: boolean;
  updateStatus: (status: Status) => void;
}

function sourceTypeToIcon(type: SourceType) {
  const iconSize = "20px";

  switch (type) {
    case SourceType.Book:
      return <Link2Icon height={iconSize} width={iconSize} />;
    case SourceType.Article:
      return <Link2Icon height={iconSize} width={iconSize} />;
    case SourceType.Video:
      return <VideoIcon height={iconSize} width={iconSize} />;
    case SourceType.Podcast:
      return <Link2Icon height={iconSize} width={iconSize} />;
    case SourceType.Course:
      return <Link2Icon height={iconSize} width={iconSize} />;
    default:
      return <Link2Icon height={iconSize} width={iconSize} />;
  }
}

export function statusToBadgeColor(status: Status) {
  switch (status) {
    case Status.NotStarted:
      return "gray";
    case Status.InProgress:
      return "blue";
    case Status.Completed:
      return "green";
    default:
      return "gray";
  }
}

export default function SourceRow({
  source,
  onClick,
  isSelected,
  updateStatus,
}: SourceRowProps) {
  return (
    <Box width="500px">
      <Card
        size="1"
        onClick={onClick}
        className={"source-row" + (isSelected ? " card-selected" : "")}
      >
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
              onValueChange={updateStatus}
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
      </Card>
    </Box>
  );
}
