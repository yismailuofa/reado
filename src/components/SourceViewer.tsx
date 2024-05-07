import {
  Badge,
  Box,
  Dialog,
  Flex,
  IconButton,
  TextField,
} from "@radix-ui/themes";
import { Viewer } from "@react-pdf-viewer/core";
import Clock from "./Clock";

import "@react-pdf-viewer/core/lib/styles/index.css";
import "@react-pdf-viewer/default-layout/lib/styles/index.css";

import {
  ArrowLeftIcon,
  ArrowRightIcon,
  ClockIcon,
  Cross2Icon,
} from "@radix-ui/react-icons";
import { defaultLayoutPlugin } from "@react-pdf-viewer/default-layout";
import { useEffect, useRef } from "react";
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
  const frameRef = useRef<HTMLIFrameElement>(null);

  const webFrame = (src: string) => (
    <iframe
      src={src}
      className="rt-reset"
      style={{
        height: "100%",
        width: "100%",
      }}
      ref={frameRef}
    />
  );

  let content;
  if (source.resource.type === "FILE") {
    const { f, page } = source.resource;
    content = (
      <Viewer
        fileUrl={f}
        plugins={[defaultLayoutPluginInstance]}
        initialPage={page}
        renderError={() => {
          return webFrame(f);
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
    content = webFrame(source.resource.url);
  }

  useEffect(() => {
    const listener = (e: BeforeUnloadEvent) => {
      e.preventDefault();
    };

    window.addEventListener("beforeunload", listener);

    return () => {
      window.removeEventListener("beforeunload", listener);
    };
  }, []);

  return (
    <Dialog.Root onOpenChange={onOpenChange} open>
      <Dialog.Content size="1" maxWidth="80%">
        <Flex gap="2" direction="column">
          <Flex gap="2" align="center">
            <Box flexGrow="1">
              <TextField.Root
                type="url"
                value={
                  source.resource.type === "URL"
                    ? source.resource.url
                    : source.resource.f
                }
                disabled
              />
            </Box>
            <Box>
              <IconButton color="gray" onClick={() => onOpenChange(false)}>
                <Cross2Icon />
              </IconButton>
            </Box>
          </Flex>
          <Flex gap="2" align="center" justify="between">
            <Flex width="30%" align="start">
              <Clock id={source.id} />
            </Flex>
            {frameRef.current && (
              <Flex gap="2" minWidth="50px" align="center">
                <IconButton size="1" onClick={() => history.back()}>
                  <ArrowLeftIcon />
                </IconButton>
                <IconButton size="1" onClick={() => history.forward()}>
                  <ArrowRightIcon />
                </IconButton>
              </Flex>
            )}
            <Flex width="30%" justify="end">
              <Badge variant="soft" color="indigo" size="2">
                <ClockIcon />
                Total Time Read: {source.timeRead.toHuman() || "0s"}
              </Badge>
            </Flex>
          </Flex>
          <Flex className="frameBox" direction="column" align="center">
            <Box style={{ height: "80vh", width: "100%" }}>{content}</Box>
          </Flex>
        </Flex>
      </Dialog.Content>
    </Dialog.Root>
  );
}
