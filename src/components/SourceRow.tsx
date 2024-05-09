import {
  ArrowTopRightIcon,
  DotsHorizontalIcon,
  Share2Icon,
  TrashIcon,
} from "@radix-ui/react-icons";
import {
  Avatar,
  Badge,
  Box,
  Button,
  Card,
  DropdownMenu,
  Flex,
  IconButton,
  Select,
  Text,
  Tooltip,
} from "@radix-ui/themes";
import { useState } from "react";
import {
  removeSource,
  updateSourceStatus,
} from "../features/sources/sourcesSlice";
import { ResourceType, Source, Status } from "../interfaces";
import { useAppDispatch } from "../store";
import {
  humanizeDuration,
  sourceTypeToIcon,
  statusToBadgeColor,
} from "../util";

interface SourceRowProps {
  source: Source;
  onClick: () => void;
}

export default function SourceRow({ source, onClick }: SourceRowProps) {
  const dispatch = useAppDispatch();
  const [deleteConfirming, setDeleteConfirming] = useState(false);
  const [copyingUrl, setCopyingUrl] = useState(false);

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
                  {source.status +
                    (source.status === Status.InProgress
                      ? ` (${humanizeDuration(source.timeRead)})`
                      : "")}
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
        <Flex justify="between" pt="3" align="end">
          <Button size="1" onClick={onClick}>
            Open
            <ArrowTopRightIcon />
          </Button>
          <DropdownMenu.Root>
            <DropdownMenu.Trigger>
              <IconButton variant="ghost" size="1">
                <DotsHorizontalIcon />
              </IconButton>
            </DropdownMenu.Trigger>
            <DropdownMenu.Content>
              <DropdownMenu.Item
                onClick={() => {
                  if (deleteConfirming) {
                    dispatch(removeSource(source.id));
                    return;
                  }
                  setDeleteConfirming(true);

                  setTimeout(() => {
                    setDeleteConfirming(false);
                  }, 2000);
                }}
                color="red"
                onSelect={(e) => {
                  e.preventDefault();
                }}
              >
                {deleteConfirming ? "Confirm" : "Delete"}
                <TrashIcon />
              </DropdownMenu.Item>
              {source.resource.type === ResourceType.URL && (
                <>
                  <DropdownMenu.Separator />
                  <DropdownMenu.Item
                    onSelect={(e) => {
                      e.preventDefault();
                    }}
                    onClick={() => {
                      if (source.resource.type === ResourceType.URL) {
                        navigator.clipboard.writeText(source.resource.url);
                        setCopyingUrl(true);

                        setTimeout(() => {
                          setCopyingUrl(false);
                        }, 2000);
                      }
                    }}
                  >
                    {copyingUrl ? "Copied!" : "Copy URL"} <Share2Icon />
                  </DropdownMenu.Item>
                </>
              )}
            </DropdownMenu.Content>
          </DropdownMenu.Root>
        </Flex>
      </Card>
    </Box>
  );
}
