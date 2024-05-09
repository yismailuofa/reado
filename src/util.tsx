import {
  GlobeIcon,
  Link2Icon,
  ReaderIcon,
  VideoIcon,
} from "@radix-ui/react-icons";
import { Duration, ToHumanDurationOptions } from "luxon";
import { Source, SourceType, Status } from "./interfaces";

export function getStats(sources: Source[]) {
  let totalTimeRead = Duration.fromObject({ seconds: 0 });
  let numCompleted = 0;
  let numInProgress = 0;
  let numNotStarted = 0;

  for (const source of sources) {
    totalTimeRead = totalTimeRead.plus(source.timeRead);

    switch (source.status) {
      case Status.Completed:
        numCompleted++;
        break;
      case Status.InProgress:
        numInProgress++;
        break;
      case Status.NotStarted:
        numNotStarted++;
        break;
    }
  }

  totalTimeRead = totalTimeRead.rescale();

  return {
    totalTimeRead,
    numCompleted,
    numInProgress,
    numNotStarted,
  };
}
export function sourceTypeToIcon(type: SourceType) {
  const iconSize = "20px";

  switch (type) {
    case SourceType.Book:
      return <ReaderIcon height={iconSize} width={iconSize} />;
    case SourceType.Article:
      return <GlobeIcon height={iconSize} width={iconSize} />;
    case SourceType.Video:
      return <VideoIcon height={iconSize} width={iconSize} />;
    default:
      return <Link2Icon height={iconSize} width={iconSize} />;
  }
}
export function statusToBadgeColor(status: Status) {
  switch (status) {
    case Status.NotStarted:
      return "gray";
    case Status.InProgress:
      return "blue";
    case Status.Completed:
      return "green";
    default:
      return "gray";
  }
}

export function sourceComparator(a: Source, b: Source): number {
  // we sort by status first, then by createdAt
  // InProgress > NotStarted > Completed order
  if (a.status === b.status) {
    return b.createdAt.toMillis() - a.createdAt.toMillis();
  }

  const statusOrder = {
    [Status.InProgress]: 0,
    [Status.NotStarted]: 1,
    [Status.Completed]: 2,
  };

  return statusOrder[a.status] - statusOrder[b.status];
}

export function humanizeDuration(
  duration: Duration,
  config: ToHumanDurationOptions = { unitDisplay: "short" }
) {
  const units = ["hours", "minutes", "seconds"] as const;
  const unit = units.find((unit) => duration.as(unit) >= 1) || "seconds";
  const num = Math.floor(duration.as(unit));

  return Duration.fromObject({ [unit]: num }).toHuman(config);
}
