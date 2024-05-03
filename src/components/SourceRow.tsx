import { Link2Icon } from "@radix-ui/react-icons";
import { Avatar, Box, Card, Flex, Text } from "@radix-ui/themes";
import { Source } from "./interfaces";

interface SourceRowProps {
  source: Source;
}

export default function SourceRow({ source }: SourceRowProps) {
  return (
    <Box width="500px">
      <Card size="1">
        <Flex gap="3" align="center">
          <Avatar
            size="3"
            radius="full"
            fallback={<Link2Icon height="20px" width="20px" />}
            variant="solid"
          />
          <Box>
            <Text as="div" size="2" weight="bold">
              {source.title}
            </Text>
            <Text as="div" size="2" color="gray">
              {source.authors}
            </Text>
          </Box>
        </Flex>
      </Card>
    </Box>
  );
}
