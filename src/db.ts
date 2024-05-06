import Dexie, { Table } from "dexie";
import { DBSource } from "./interfaces";

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
