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
import { DBSource } from "../db";
import { SourceType, Status } from "../interfaces";

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
      />
    </Flex>
  );
}

function UrlOrFileRow({ source, setSource }: SourceProps) {
  const hasFile = source.file !== null;

  return (
    <Flex direction="row" gap="3" align="center">
      <Text weight="bold" size="1" style={{ width: "20%" }}>
        URL
      </Text>
      <TextField.Root
        placeholder="URL"
        style={{ width: hasFile ? "69%" : "50%" }}
        value={hasFile ? source.file!.name : source.url}
        onChange={(e) => setSource({ ...source, url: e.target.value })}
        disabled={hasFile}
      />
      <input
        type="file"
        id="file-input"
        accept=".pdf"
        onChange={(e) => {
          if (e.target.files && e.target.files.length > 0) {
            setSource({ ...source, file: e.target.files[0], url: "" });
          }
        }}
      />
      {hasFile ? (
        <IconButton onClick={() => setSource({ ...source, file: null })}>
          <Cross2Icon />
        </IconButton>
      ) : (
        <Button
          style={{ width: "25%" }}
          onClick={() => document.getElementById("file-input")?.click()}
        >
          Upload
          <UploadIcon />
        </Button>
      )}
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

export default function CreateButton({
  addSource,
}: {
  addSource: (source: DBSource) => void;
}) {
  const defaultSource: DBSource = {
    title: "",
    authors: "",
    url: "",
    timeRead: Duration.fromObject({}).toObject(),
    type: SourceType.Article,
    createdAt: DateTime.now().toJSDate(),
    updatedAt: DateTime.now().toJSDate(),
    status: Status.NotStarted,
    file: null,
  };
  const [source, setSource] = useState<DBSource>(defaultSource);
  const [open, setOpen] = useState(false);

  const handleCreate = useCallback(() => {
    if (!source.title || !source.authors || (!source.url && !source.file)) {
      return;
    }

    addSource(source);
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
      </Dialog.Content>
    </Dialog.Root>
  );
}
