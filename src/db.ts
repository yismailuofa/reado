// db.ts
import Dexie, { Table } from "dexie";
import { DateTime, Duration } from "luxon";
import { Source } from "./interfaces";

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
