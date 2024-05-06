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
  Tooltip,
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
      />
    </Flex>
  );
}

function UrlOrFileRow({ source, setSource }: SourceProps) {
  const hasFile = source.resource.type === ResourceType.FILE;

  return (
    <Flex direction="row" gap="3" align="center">
      <Tooltip content="Upload a PDF file or provide a URL. Only uploaded PDFs have their page progess saved.">
        <Text weight="bold" size="1" style={{ width: "20%" }}>
          URL/PDF{" "}
          <Text>
            <svg
              width="12"
              height="12"
              viewBox="0 0 15 15"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M7.49991 0.876892C3.84222 0.876892 0.877075 3.84204 0.877075 7.49972C0.877075 11.1574 3.84222 14.1226 7.49991 14.1226C11.1576 14.1226 14.1227 11.1574 14.1227 7.49972C14.1227 3.84204 11.1576 0.876892 7.49991 0.876892ZM1.82707 7.49972C1.82707 4.36671 4.36689 1.82689 7.49991 1.82689C10.6329 1.82689 13.1727 4.36671 13.1727 7.49972C13.1727 10.6327 10.6329 13.1726 7.49991 13.1726C4.36689 13.1726 1.82707 10.6327 1.82707 7.49972ZM8.24992 4.49999C8.24992 4.9142 7.91413 5.24999 7.49992 5.24999C7.08571 5.24999 6.74992 4.9142 6.74992 4.49999C6.74992 4.08577 7.08571 3.74999 7.49992 3.74999C7.91413 3.74999 8.24992 4.08577 8.24992 4.49999ZM6.00003 5.99999H6.50003H7.50003C7.77618 5.99999 8.00003 6.22384 8.00003 6.49999V9.99999H8.50003H9.00003V11H8.50003H7.50003H6.50003H6.00003V9.99999H6.50003H7.00003V6.99999H6.50003H6.00003V5.99999Z"
                fill="currentColor"
                fill-rule="evenodd"
                clip-rule="evenodd"
              ></path>
            </svg>
          </Text>
        </Text>
      </Tooltip>
      <TextField.Root
        placeholder="URL"
        style={{ width: hasFile ? "69%" : "50%" }}
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
        <IconButton onClick={() => setSource({ ...source })}>
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
