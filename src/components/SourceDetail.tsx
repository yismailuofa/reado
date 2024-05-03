import { ArrowTopRightIcon } from "@radix-ui/react-icons";
import { Button, Card, Flex, Separator, Text } from "@radix-ui/themes";
import { Source } from "../interfaces";
import Clock from "./Clock";

interface SourceDetailProps {
  source: Source | null;
}

export default function SourceDetail({ source }: SourceDetailProps) {
  const content = source ? (
    <Flex direction="column" gap="3" height="100%">
      <Text as="div" size="2" weight="medium">
        {source.title}
      </Text>
      <Separator style={{ width: "100%" }} />
      <Button asChild>
        <a href={source.url} target="_blank" rel="noreferrer">
          Open
          <ArrowTopRightIcon />
        </a>
      </Button>
      <Clock />
    </Flex>
  ) : (
    <Flex
      direction="column"
      align="center"
      gap="3"
      height="100%"
      justify="center"
    >
      <Text size="4"> No source selected </Text>
    </Flex>
  );

  return <Card style={{ height: "100%" }}>{content}</Card>;
}
