import { Link2Icon, VideoIcon } from "@radix-ui/react-icons";
import {
  Avatar,
  Badge,
  Box,
  Card,
  Flex,
  Text,
  Tooltip,
} from "@radix-ui/themes";
import { Source, SourceType } from "../interfaces";

interface SourceRowProps {
  source: Source;
  onClick: () => void;
  isSelected: boolean;
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

export default function SourceRow({
  source,
  onClick,
  isSelected,
}: SourceRowProps) {
  return (
    <Box width="500px" className="source-row">
      <Card
        size="1"
        onClick={onClick}
        className={isSelected ? "card-selected" : ""}
      >
        <Flex gap="3" align="center">
          <Avatar
            size="3"
            radius="full"
            fallback={sourceTypeToIcon(source.type)}
            variant="solid"
          />
          <Box>
            <Tooltip content={source.title}>
              <Text as="div" size="2" weight="bold" className="line-overflow">
                {source.title}
              </Text>
            </Tooltip>
            <Tooltip content={source.authors}>
              <Text as="div" size="2" color="gray" className="line-overflow">
                {source.authors}
              </Text>
            </Tooltip>
          </Box>
          <Box ml="auto">
            <Badge>{source.type}</Badge>
          </Box>
        </Flex>
      </Card>
    </Box>
  );
}
