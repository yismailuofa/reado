// db.ts
import Dexie, { Table } from "dexie";
import { Source } from "./interfaces";

export interface DBSource
  extends Omit<Source, "id" | "createdAt" | "updatedAt" | "timeRead"> {
  id?: number;
  createdAt: object;
  updatedAt: object;
  timeRead: object;
}

export class SourceDexie extends Dexie {
  sources!: Table<DBSource>;

  constructor() {
    super("readoDB");
    this.version(2).stores({
      sources: "++id",
    });
  }
}

export const db = new SourceDexie();
