import { Cross2Icon, PlusIcon, UploadIcon } from "@radix-ui/react-icons";
import {
  Box,
  Button,
  Dialog,
  Flex,
  IconButton,
  Select,
  Text,
  TextField,
} from "@radix-ui/themes";
import { DateTime, Duration } from "luxon";
import { useCallback, useState } from "react";
import { addSource } from "../features/sources/sourcesSlice";
import { DBSource, ResourceType, SourceType, Status } from "../interfaces";
import { useAppDispatch } from "../store";

interface TextRowProps extends SourceProps {
  label: string;
  srcKey: keyof DBSource;
}

interface SourceProps {
  source: DBSource;
  setSource: (source: DBSource) => void;
}

function TextRow({ label, source, setSource, srcKey }: TextRowProps) {
  return (
    <Flex direction="row" gap="3" align="center">
      <Text weight="bold" size="1" style={{ width: "20%" }}>
        {label.toUpperCase()}
      </Text>
      <TextField.Root
        placeholder={label}
        style={{ width: "80%" }}
        value={source[srcKey] as string}
        onChange={(e) => setSource({ ...source, [srcKey]: e.target.value })}
        required
      />
    </Flex>
  );
}

function UrlOrFileRow({ source, setSource }: SourceProps) {
  const hasFile = source.resource.type === ResourceType.FILE;

  return (
    <Flex direction="column" gap="1">
      <Flex direction="row" gap="3" align="center">
        <Text weight="bold" size="1" style={{ width: "20%" }}>
          URL/PDF
        </Text>
        <TextField.Root
          placeholder="URL"
          style={{ width: hasFile ? "68%" : "51%" }}
          value={
            source.resource.type === ResourceType.FILE
              ? (source.resource.f as File).name
              : source.resource.url
          }
          onChange={(e) =>
            setSource({
              ...source,
              resource: {
                type: ResourceType.URL,
                url: e.target.value,
              },
            })
          }
          required
          disabled={hasFile}
        />
        <input
          type="file"
          id="file-input"
          accept=".pdf"
          onChange={(e) => {
            if (e.target.files && e.target.files.length > 0) {
              setSource({
                ...source,
                resource: {
                  type: ResourceType.FILE,
                  f: e.target.files[0],
                  page: 0,
                },
              });
            }
          }}
        />
        {hasFile ? (
          <IconButton
            onClick={() =>
              setSource({
                ...source,
                resource: { type: ResourceType.URL, url: "" },
              })
            }
          >
            <Cross2Icon />
          </IconButton>
        ) : (
          <Button
            style={{ width: "25%" }}
            onClick={(e) => {
              e.preventDefault();
              document.getElementById("file-input")?.click();
            }}
          >
            Upload
            <UploadIcon />
          </Button>
        )}
      </Flex>
      <Text size="1" weight="light">
        Note: Only uploaded PDFs will have their page progress saved.
      </Text>
    </Flex>
  );
}

function TypeSelectRow({ source, setSource }: SourceProps) {
  return (
    <Flex direction="row" gap="3" align="center">
      <Text weight="bold" size="1" style={{ width: "20%" }}>
        TYPE
      </Text>
      <Box ml="-2px">
        <Select.Root
          value={source.type}
          onValueChange={(value) =>
            setSource({ ...source, type: value as SourceType })
          }
        >
          <Select.Trigger />
          <Select.Content>
            {Object.values(SourceType).map((type) => (
              <Select.Item key={type} value={type}>
                {type}
              </Select.Item>
            ))}
          </Select.Content>
        </Select.Root>
      </Box>
    </Flex>
  );
}

export default function CreateButton() {
  const dispatch = useAppDispatch();

  const defaultSource: DBSource = {
    title: "",
    authors: "",
    resource: { type: ResourceType.URL, url: "" },
    timeRead: Duration.fromObject({}).toObject(),
    type: SourceType.Article,
    createdAt: DateTime.now().toObject(),
    updatedAt: DateTime.now().toObject(),
    status: Status.NotStarted,
  };
  const [source, setSource] = useState<DBSource>(defaultSource);
  const [open, setOpen] = useState(false);

  const handleCreate = useCallback(() => {
    if (
      !source.title ||
      !source.authors ||
      !(source.resource.type === ResourceType.URL
        ? source.resource.url
        : source.resource.f)
    ) {
      return;
    }

    dispatch(addSource(source));
    setSource(defaultSource);
    setOpen(false);
  }, [source]);

  return (
    <Dialog.Root open={open} onOpenChange={setOpen}>
      <Dialog.Trigger>
        <Button size="1">
          Create Source
          <PlusIcon />
        </Button>
      </Dialog.Trigger>
      <Dialog.Content maxWidth="450px">
        <Dialog.Title>Create Source</Dialog.Title>
        <form>
          <Flex gap="3" direction="column" pt="4">
            <TextRow
              label="Title"
              source={source}
              setSource={setSource}
              srcKey="title"
            />

            <UrlOrFileRow source={source} setSource={setSource} />
            <TextRow
              label="Authors"
              source={source}
              setSource={setSource}
              srcKey="authors"
            />
            <TypeSelectRow source={source} setSource={setSource} />
          </Flex>
          <Flex gap="3" mt="4" justify="end">
            <Dialog.Close>
              <Button variant="soft" color="gray">
                Cancel
              </Button>
            </Dialog.Close>
            <Button variant="solid" onClick={handleCreate}>
              Create
            </Button>
          </Flex>
        </form>
      </Dialog.Content>
    </Dialog.Root>
  );
}
