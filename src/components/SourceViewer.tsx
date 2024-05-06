import { Badge, Box, Dialog, Flex, TextField } from "@radix-ui/themes";
import { Viewer } from "@react-pdf-viewer/core";
import { Source } from "../interfaces";
import Clock from "./Clock";

import "@react-pdf-viewer/core/lib/styles/index.css";
import "@react-pdf-viewer/default-layout/lib/styles/index.css";

import { defaultLayoutPlugin } from "@react-pdf-viewer/default-layout";
import { updateSourcePage } from "../features/sources/sourcesSlice";
import { useAppDispatch } from "../store";

interface SourceViewerProps {
  source: Source;
  onOpenChange: (open: boolean) => void;
}

export default function SourceViewer({
  source,
  onOpenChange,
}: SourceViewerProps) {
  const defaultLayoutPluginInstance = defaultLayoutPlugin({
    sidebarTabs: () => [],
  });
  const dispatch = useAppDispatch();

  let content;
  if (source.resource.type === "FILE") {
    const { f, page } = source.resource;
    content = (
      <Viewer
        fileUrl={f}
        plugins={[defaultLayoutPluginInstance]}
        initialPage={page}
        renderError={(error) => {
          console.error("Fallback to iframe", error);
          return (
            <iframe
              src={f}
              className="rt-reset"
              style={{
                height: "100%",
                width: "100%",
              }}
            />
          );
        }}
        onPageChange={(e) => {
          dispatch(
            updateSourcePage({
              id: source.id,
              page: e.currentPage,
            })
          );
        }}
      />
    );
  } else {
    content = (
      <iframe
        src={source.resource.url}
        className="rt-reset"
        style={{
          height: "100%",
          width: "100%",
        }}
      />
    );
  }

  return (
    <Dialog.Root onOpenChange={onOpenChange} open>
      <Dialog.Content size="1" maxWidth="80%">
        <Flex gap="2" direction="column">
          <TextField.Root
            type="url"
            value={
              source.resource.type === "URL"
                ? source.resource.url
                : source.resource.f
            }
            disabled
          />
          <Flex gap="2" align="center" justify="between">
            <Clock />
            <Badge variant="soft" color="indigo" size="2">
              Time Read: 1 hour
            </Badge>
          </Flex>
          <Flex className="frameBox" direction="column" align="center">
            <Box style={{ height: "80vh", width: "100%" }}>{content}</Box>
          </Flex>
        </Flex>
      </Dialog.Content>
    </Dialog.Root>
  );
}
