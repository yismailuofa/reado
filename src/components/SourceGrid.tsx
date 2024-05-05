import { InfoCircledIcon } from "@radix-ui/react-icons";
import { Callout, Flex } from "@radix-ui/themes";
import { Source, Status } from "../interfaces";
import SourceRow from "./SourceRow";

interface SourceGridProps {
  sources: Source[];
  selectedSource: Source | null;
  handleGridClick: (id: number) => void;
  updateStatus: (id: number) => (status: Status) => void;
}

export default function sources({
  sources,
  selectedSource,
  handleGridClick,
  updateStatus,
}: SourceGridProps) {
  return (
    <Flex gap="4" direction="column" align="center">
      {sources.length ? (
        sources.map((source, index) => (
          <SourceRow
            key={source.id}
            source={source}
            isSelected={selectedSource?.id === source.id}
            onClick={() => handleGridClick(index)}
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
