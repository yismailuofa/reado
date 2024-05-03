import { Flex } from "@radix-ui/themes";
import SourceRow from "./SourceRow";
import { Source } from "./interfaces";

interface SourceGridProps {
  sources: Source[];
}

export default function sources({ sources }: SourceGridProps) {
  return (
    <Flex gap="4" direction="column" align="center">
      {sources.map((source) => (
        <SourceRow key={source.id} source={source} />
      ))}
    </Flex>
  );
}
