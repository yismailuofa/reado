import { Badge, Box, Dialog, Flex, TextField } from "@radix-ui/themes";
import { Viewer } from "@react-pdf-viewer/core";
import Clock from "./Clock";

import "@react-pdf-viewer/core/lib/styles/index.css";
import "@react-pdf-viewer/default-layout/lib/styles/index.css";

import { ClockIcon } from "@radix-ui/react-icons";
import { defaultLayoutPlugin } from "@react-pdf-viewer/default-layout";
import {
  sourceSelector,
  storeSourceToSource,
  updateSourcePage,
} from "../features/sources/sourcesSlice";
import { useAppDispatch, useAppSelector } from "../store";

interface SourceViewerProps {
  sourceId: number;
  onOpenChange: (open: boolean) => void;
}

export default function SourceViewer({
  sourceId,
  onOpenChange,
}: SourceViewerProps) {
  const defaultLayoutPluginInstance = defaultLayoutPlugin({
    sidebarTabs: () => [],
  });
  const source = storeSourceToSource(useAppSelector(sourceSelector(sourceId))!);
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
            <Clock id={source.id} />
            <Badge variant="soft" color="indigo" size="2">
              <ClockIcon />
              Total Time Read: {source.timeRead.toHuman() || "0s"}
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
