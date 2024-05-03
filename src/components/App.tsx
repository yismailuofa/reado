import { Box, Container, Flex, Heading, Separator } from "@radix-ui/themes";
import { useState } from "react";
import { Source, SourceType } from "../interfaces";
import CreateButton from "./CreateButton";
import SourceDetail from "./SourceDetail";
import SourceGrid from "./SourceGrid";

export default function App() {
  const [sources, setSources] = useState<Source[]>([
    {
      id: "1",
      timeRead: 0,
      title: "Introduction to Information Retrieval",
      type: SourceType.Course,
      url: "https://nlp.stanford.edu/IR-book/pdf/irbookonlinereading.pdf",
      authors: "Christopher Manning, Prabhakar Raghavan, Hinrich Schütze",
    },
    {
      id: "1",
      timeRead: 0,
      title: "Designing Data-Intensive Applications",
      type: SourceType.Book,
      url: "https://www.amazon.com/Designing-Data-Intensive-Applications-Reliable-Maintainable/dp/1449373321",
      authors: "Martin Kleppmann",
    },
    {
      id: "1",
      timeRead: 0,
      title: "Curated Engineering Blog Posts",
      type: SourceType.Article,
      url: "https://www.linkedin.com/posts/ryanlpeterman_19-vetted-company-engineering-blog-posts-activity-7138557807481475072-FX9U",
      authors: "Ryan Peterman",
    },
    {
      id: "1",
      timeRead: 0,
      title: "Database Internals",
      type: SourceType.Book,
      url: "https://www.oreilly.com/library/view/database-internals/9781492040330/",
      authors: "Alex Petrov",
    },
    {
      id: "1",
      timeRead: 0,
      title: "Machine Learning Engineering Open Book",
      type: SourceType.Book,
      url: "https://github.com/stas00/ml-engineering",
      authors: "Stas Bekman",
    },
    {
      id: "1",
      timeRead: 0,
      title: "Engineering MLOps",
      type: SourceType.Book,
      url: "https://www.oreilly.com/library/view/engineering-mlops/9781800562882/",
      authors: "Emmanuel Raj",
    },
    {
      id: "1",
      timeRead: 0,
      title: "Professional Programming",
      type: SourceType.Article,
      url: "https://github.com/charlax/professional-programming",
      authors: "Charles-Axel Dein",
    },
    {
      id: "1",
      timeRead: 0,
      title: "Eugene Yan: ML Ops",
      type: SourceType.Article,
      url: "https://eugeneyan.com/start-here/",
      authors: "Eugene Yan",
    },
    {
      id: "1",
      timeRead: 0,
      title: "Explaining The Postgres Meme",
      type: SourceType.Article,
      url: "https://avestura.dev/blog/explaining-the-postgres-meme",
      authors: "Aryan Ebrahimpour",
    },
    {
      id: "1",
      timeRead: 0,
      title: "CMU Database Group",
      type: SourceType.Video,
      url: "https://www.youtube.com/@CMUDatabaseGroup/videos",
      authors: "CMU Database Group",
    },
    {
      id: "1",
      timeRead: 0,
      title: "MIT 6.824 Distributed Systems (Spring 2020)",
      type: SourceType.Video,
      url: "https://www.youtube.com/playlist?list=PLrw6a1wE39_tb2fErI4-WkMbsvGQk9_UB",
      authors: "MIT",
    },
    {
      id: "1",
      timeRead: 0,
      title: "Fullstack React GraphQL TypeScript Tutorial",
      type: SourceType.Video,
      url: "https://www.youtube.com/watch?v=I6ypD7qv3Z8",
      authors: "Ben Awad",
    },
    {
      id: "1",
      timeRead: 0,
      title: "Lessons from building GitHub code search",
      type: SourceType.Video,
      url: "https://www.youtube.com/watch?v=CqZA_KmygKw",
      authors: "GitHub",
    },
    {
      id: "1",
      timeRead: 0,
      title: "Building Secure and Reliable Systems",
      type: SourceType.Book,
      url: "https://google.github.io/building-secure-and-reliable-systems/raw/toc.html",
      authors: "Google",
    },
    {
      id: "1",
      timeRead: 0,
      title: "Practical Deep Learning",
      type: SourceType.Course,
      url: "https://course.fast.ai/",
      authors: "Jeremy Howard",
    },
    {
      id: "1",
      timeRead: 0,
      title: "The Complete History & Strategy of Visa",
      type: SourceType.Podcast,
      url: "https://www.acquired.fm/episodes/visa",
      authors: "Ben Gilbert and David Rosenthal",
    },
    {
      id: "1",
      timeRead: 0,
      title: "Production Prolog",
      type: SourceType.Video,
      url: "https://www.youtube.com/watch?v=G_eYTctGZw8",
      authors: "Michael Hendricks",
    },
    {
      id: "1",
      timeRead: 0,
      title: "The Best Books to Learn Apache Kafka",
      type: SourceType.Article,
      url: "https://1900jwatson.medium.com/the-best-books-to-learn-apache-kafka-b808f9be43d9",
      authors: "John L. Watson",
    },
    {
      id: "1",
      timeRead: 0,
      title: "Coding Adventures",
      type: SourceType.Video,
      url: "https://www.youtube.com/playlist?list=PLFt_AvWsXl0ehjAfLFsp1PGaatzAwo0uK",
      authors: "Sebastian Lague",
    },
  ]);
  const [selectedSourceIndex, setSelectedSourceIndex] = useState<number | null>(
    null
  );

  return (
    <Container size="3" pt="4">
      <Box p="4">
        <CreateButton
          addSource={(source: Source) => setSources([...sources, source])}
        />
      </Box>
      <Flex justify="center">
        <Separator style={{ width: "100%" }} mb="2" />
      </Flex>
      <Flex>
        <Box width="60%">
          <Heading as="h2" size="3" weight="bold" align="center">
            Knowledge Sources
          </Heading>
          <Box pt="4" style={{ overflowY: "auto", height: "510px" }}>
            <SourceGrid
              sources={sources}
              selectedSourceIndex={selectedSourceIndex}
              setSelectedSourceIndex={setSelectedSourceIndex}
            />
          </Box>
        </Box>
        <Box width="40%">
          <Heading as="h2" size="3" weight="bold" align="center">
            Source Details
          </Heading>
          <Box pt="4" style={{ overflowY: "auto", height: "510px" }}>
            <SourceDetail
              source={
                selectedSourceIndex !== null
                  ? sources[selectedSourceIndex]
                  : null
              }
            />
          </Box>
        </Box>
      </Flex>
    </Container>
  );
}
