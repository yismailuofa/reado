import { DateTime, Duration } from "luxon";

export enum SourceType {
  Article = "Article",
  Video = "Video",
  Book = "Book",
}

export enum ResourceType {
  FILE = "FILE",
  URL = "URL",
}

export type URLRecord = { type: ResourceType.URL; url: string };
export type FileRecord = { type: ResourceType.FILE; f: string; page: number };
export type DBFileRecord = {
  type: ResourceType.FILE;
  f: File | string;
  page: number;
};

export type DBSourceResource = URLRecord | DBFileRecord;
export type SourceResource = URLRecord | FileRecord;

export enum Status {
  NotStarted = "Not Started",
  InProgress = "In Progress",
  Completed = "Completed",
}

export interface Source
  extends Omit<StoreSource, "createdAt| updatedAt | timeRead"> {
  createdAt: DateTime;
  updatedAt: DateTime;
  timeRead: Duration;
}

export interface StoreSource extends Omit<DBSource, "id" | "resource"> {
  id: number;
  resource: SourceResource;
}

export interface DBSource {
  id?: number;
  title: string;
  authors: string;
  resource: DBSourceResource;
  type: SourceType;
  status: Status;
  createdAt: object;
  updatedAt: object;
  timeRead: object;
}

export interface AggrStats {
  totalTimeRead: Duration;
  numCompleted: number;
  numInProgress: number;
  numNotStarted: number;
}
