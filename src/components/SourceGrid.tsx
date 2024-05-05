import { InfoCircledIcon } from "@radix-ui/react-icons";
import { Callout, Flex } from "@radix-ui/themes";
import { Source, Status } from "../interfaces";
import SourceRow from "./SourceRow";

interface SourceGridProps {
  sources: Source[];
  selectedId: number | null;
  handleGridClick: (id: number) => void;
  updateStatus: (id: number) => (status: Status) => void;
}

export default function sources({
  sources,
  selectedId,
  handleGridClick,
  updateStatus,
}: SourceGridProps) {
  return (
    <Flex gap="4" direction="column" align="center">
      {sources.length ? (
        sources.map((source) => (
          <SourceRow
            key={source.id}
            source={source}
            isSelected={selectedId === source.id}
            onClick={() => handleGridClick(source.id)}
            updateStatus={updateStatus(source.id)}
          />
        ))
      ) : (
        <Callout.Root variant="outline">
          <Callout.Icon>
            <InfoCircledIcon />
          </Callout.Icon>
          <Callout.Text>
            No sources found. Add a new source by clicking the button above.
          </Callout.Text>
        </Callout.Root>
      )}
    </Flex>
  );
}
