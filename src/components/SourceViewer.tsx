import {
  Badge,
  Box,
  Dialog,
  Flex,
  IconButton,
  TextField,
  Tooltip,
} from "@radix-ui/themes";
import { Viewer } from "@react-pdf-viewer/core";
import Clock from "./Clock";

import "@react-pdf-viewer/core/lib/styles/index.css";
import "@react-pdf-viewer/default-layout/lib/styles/index.css";

import {
  ActivityLogIcon,
  ArrowLeftIcon,
  ArrowRightIcon,
  ClockIcon,
  Cross2Icon,
} from "@radix-ui/react-icons";
import { defaultLayoutPlugin } from "@react-pdf-viewer/default-layout";
import { useEffect, useMemo, useRef } from "react";
import {
  sourceSelector,
  storeSourceToSource,
  updateSourcePage,
} from "../features/sources/sourcesSlice";
import { useAppDispatch, useAppSelector } from "../store";
import { humanizeDuration } from "../util";

interface SourceViewerProps {
  sourceId: number;
  onOpenChange: (open: boolean) => void;
}

export default function SourceViewer({
  sourceId,
  onOpenChange,
}: SourceViewerProps) {
  const defaultLayoutPluginInstance = defaultLayoutPlugin({
    sidebarTabs: (defaultTabs) => [
      {
        ...defaultTabs[1],
        icon: <ActivityLogIcon />,
        title: "Table of Contents",
      },
    ],
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

  const content = useMemo(() => {
    if (source.resource.type === "FILE") {
      const { f, page } = source.resource;
      return (
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
      return webFrame(source.resource.url);
    }
  }, [source.resource, source.id]);

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
              <Tooltip content={source.timeRead.toHuman()}>
                <Badge variant="soft" color="indigo" size="2">
                  <ClockIcon />
                  Total Time Read: {humanizeDuration(source.timeRead, {})}
                </Badge>
              </Tooltip>
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
