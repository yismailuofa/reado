import { Box, Container, Separator } from "@radix-ui/themes";
import CreateButton from "./CreateButton";
import SourceGrid from "./SourceGrid";
import { Source, SourceType } from "./interfaces";

export default function App() {
  const sources: Source[] = [
    {
      id: "1",
      title: "The Pragmatic Programmer",
      url: "google.com",
      authors: "Andrew Hunt, David Thomas",
      timeRead: 10,
      type: SourceType.Book,
    },
    {
      id: "2",
      title: "The Clean Coder",
      url: "google.com",
      authors: "Robert C. Martin",
      timeRead: 10,
      type: SourceType.Book,
    },
    {
      id: "3",
      title: "The Clean Code",
      url: "google.com",
      authors: "Robert C. Martin",
      timeRead: 10,
      type: SourceType.Book,
    },
  ];

  return (
    <Container size="3" pt="4">
      <Box p="4">
        <CreateButton />
      </Box>
      <Separator style={{ width: "100%" }} />
      <Box p="4">
        <SourceGrid sources={sources} />
      </Box>
    </Container>
  );
}
