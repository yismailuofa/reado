import { PlusIcon } from "@radix-ui/react-icons";
import {
  Button,
  Dialog,
  Flex,
  Select,
  Text,
  TextField,
} from "@radix-ui/themes";
import { useCallback, useState } from "react";
import { Source, SourceType } from "../interfaces";

interface TextRowProps extends SourceProps {
  label: string;
  srcKey: keyof Source;
}

interface SourceProps {
  source: Source;
  setSource: (source: Source) => void;
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
        value={source[srcKey]}
        onChange={(e) => setSource({ ...source, [srcKey]: e.target.value })}
      />
    </Flex>
  );
}

function TypeRow({ source, setSource }: SourceProps) {
  return (
    <Flex direction="row" gap="3" align="center">
      <Text weight="bold" size="1" style={{ width: "20%" }}>
        TYPE
      </Text>
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
    </Flex>
  );
}

export default function CreateButton({
  addSource,
}: {
  addSource: (source: Source) => void;
}) {
  const defaultSource: Source = {
    id: "",
    title: "",
    authors: "",
    url: "",
    timeRead: 0,
    type: SourceType.Article,
  };
  const [source, setSource] = useState<Source>(defaultSource);
  const [open, setOpen] = useState(false);

  const handleCreate = useCallback(() => {
    if (!source.title || !source.authors || !source.url) return;

    addSource(source);
    setSource(defaultSource);
    setOpen(false);
  }, [source]);

  return (
    <Dialog.Root open={open} onOpenChange={setOpen}>
      <Dialog.Trigger>
        <Button variant="surface">
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
          <TextRow
            label="URL"
            source={source}
            setSource={setSource}
            srcKey="url"
          />
          <TextRow
            label="Authors"
            source={source}
            setSource={setSource}
            srcKey="authors"
          />
          <TypeRow source={source} setSource={setSource} />
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