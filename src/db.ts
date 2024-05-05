// db.ts
import Dexie, { Table } from "dexie";
import { DateTime, Duration } from "luxon";
import { Source, Status } from "./interfaces";

export interface DBSource
  extends Omit<Source, "id" | "createdAt" | "updatedAt" | "timeRead"> {
  id?: number;
  createdAt: Date;
  updatedAt: Date;
  timeRead: object;
}

export class SourceDexie extends Dexie {
  sources!: Table<DBSource>;

  constructor() {
    super("readoDB");
    this.version(1).stores({
      sources: "++id",
    });
  }
}

export const db = new SourceDexie();

export function mapDBSourceToSource(dbSource: DBSource): Source {
  return {
    ...dbSource,
    id: dbSource.id!,
    createdAt: DateTime.fromJSDate(dbSource.createdAt),
    updatedAt: DateTime.fromJSDate(dbSource.updatedAt),
    timeRead: Duration.fromObject(dbSource.timeRead),
  };
}

export function sourceComparator(a: Source, b: Source): number {
  // we sort by status first, then by updatedAt
  // InProgress > NotStarted > Completed order

  if (a.status === b.status) {
    return a.updatedAt.toMillis() - b.updatedAt.toMillis();
  }

  const statusOrder = {
    [Status.InProgress]: 0,
    [Status.NotStarted]: 1,
    [Status.Completed]: 2,
  };

  return statusOrder[a.status] - statusOrder[b.status];
}

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

  return {
    totalTimeRead,
    numCompleted,
    numInProgress,
    numNotStarted,
  };
}
