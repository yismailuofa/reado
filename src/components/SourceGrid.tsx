import { Flex } from "@radix-ui/themes";
import { Source } from "../interfaces";
import SourceRow from "./SourceRow";

interface SourceGridProps {
  sources: Source[];
  selectedSourceIndex: number | null;
  setSelectedSourceIndex: (index: number) => void;
}

export default function sources({
  sources,
  selectedSourceIndex,
  setSelectedSourceIndex,
}: SourceGridProps) {
  return (
    <Flex gap="4" direction="column" align="center">
      {sources.map((source, index) => (
        <SourceRow
          key={source.id}
          source={source}
          isSelected={selectedSourceIndex === index}
          onClick={() => setSelectedSourceIndex(index)}
        />
      ))}
    </Flex>
  );
}
