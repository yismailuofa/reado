import { Flex } from "@radix-ui/themes";
import { Source, Status } from "../interfaces";
import SourceRow from "./SourceRow";

interface SourceGridProps {
  sources: Source[];
  selectedSourceIndex: number | null;
  handleGridClick: (index: number) => void;
  updateStatus: (index: number) => (status: Status) => void;
}

export default function sources({
  sources,
  selectedSourceIndex,
  handleGridClick,
  updateStatus,
}: SourceGridProps) {
  return (
    <Flex gap="4" direction="column" align="center">
      {sources.map((source, index) => (
        <SourceRow
          key={source.id}
          source={source}
          isSelected={selectedSourceIndex === index}
          onClick={() => handleGridClick(index)}
          updateStatus={updateStatus(index)}
        />
      ))}
    </Flex>
  );
}
