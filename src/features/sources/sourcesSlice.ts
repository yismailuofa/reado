import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { DateTime, Duration } from "luxon";
import { db } from "../../db";
import {
  DBSource,
  ResourceType,
  Source,
  SourceResource,
  Status,
  StoreSource,
} from "../../interfaces";
import type { RootState } from "../../store";

export interface SourcesState {
  sources: StoreSource[];
}

const initialState: SourcesState = {
  sources: [],
};

const sourcesSlice = createSlice({
  name: "sources",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(loadSources.fulfilled, (state, action) => {
      state.sources = action.payload;
    });
    builder.addCase(addSource.fulfilled, (state, action) => {
      state.sources.push(action.payload);
    });
    builder.addCase(removeSource.fulfilled, (state, action) => {
      state.sources = state.sources.filter(
        (source) => source.id !== action.payload
      );
    });
    builder.addCase(updateSourceStatus.fulfilled, (state, action) => {
      const source = state.sources.find(
        (source) => source.id === action.payload.id
      );
      if (source) {
        source.status = action.payload.status;
      }
    });
    builder.addCase(incrementTimeRead.fulfilled, (state, action) => {
      const source = state.sources.find(
        (source) => source.id === action.payload.id
      );
      if (source) {
        source.timeRead = Duration.fromObject(source.timeRead)
          .plus({
            seconds: 1,
          })
          .rescale()
          .toObject();
        source.updatedAt = DateTime.now();
      }
    });
    builder.addCase(updateSourcePage.fulfilled, (state, action) => {
      const source = state.sources.find(
        (source) => source.id === action.payload.id
      );
      if (source && source.resource.type === ResourceType.FILE) {
        source.resource.page = action.payload.page;
      }
    });
  },
});

export default sourcesSlice.reducer;

export const sourcesSelector = (state: RootState) => state.sources.sources;

export const loadSources = createAsyncThunk("sources/loadSources", async () => {
  const sources = (await db.sources.toArray()).map(dbSourceToStoreSource);
  return sources;
});

export const addSource = createAsyncThunk(
  "sources/addSource",
  async (dbSrc: DBSource) => {
    if (
      dbSrc.resource.type === ResourceType.URL &&
      dbSrc.resource.url.endsWith(".pdf")
    ) {
      dbSrc.resource = {
        type: ResourceType.FILE,
        f: dbSrc.resource.url,
        page: 1,
      };
    }

    const id = await db.sources.add(dbSrc);

    return dbSourceToStoreSource({ ...dbSrc, id });
  }
);

export const removeSource = createAsyncThunk(
  "sources/removeSource",
  async (id: number) => {
    await db.sources.delete(id);
    return id;
  }
);

export const updateSourceStatus = createAsyncThunk(
  "sources/updateSourceStatus",
  async ({ id, status }: { id: number; status: Status }) => {
    await db.sources.update(id, { status });
    return { id, status };
  }
);

export const incrementTimeRead = createAsyncThunk(
  "sources/incrementTimeRead",
  async ({ id }: { id: number }) => {
    await db.sources.where({ id }).modify((source) => {
      source.timeRead = Duration.fromObject(source.timeRead)
        .plus({ seconds: 1 })
        .rescale()
        .toObject();
      source.updatedAt = DateTime.now().toObject();
    });
    return { id };
  }
);

export const updateSourcePage = createAsyncThunk(
  "sources/updateSourcePage",
  async ({ id, page }: { id: number; page: number }) => {
    await db.sources.update(id, { "file.page": page } as any);
    return { id, page };
  }
);

const dbSourceToStoreSource = (dbSource: DBSource): StoreSource => {
  let resource: SourceResource;
  if (dbSource.resource.type === ResourceType.URL) {
    resource = dbSource.resource;
  } else {
    resource = {
      ...dbSource.resource,
      f:
        typeof dbSource.resource.f === "string"
          ? dbSource.resource.f
          : URL.createObjectURL(dbSource.resource.f),
    };
  }
  return {
    ...dbSource,
    id: dbSource.id!,
    resource,
  };
};

export const storeSourceToSource = (storeSource: StoreSource): Source => ({
  ...storeSource,
  createdAt: DateTime.fromObject(storeSource.createdAt),
  updatedAt: DateTime.fromObject(storeSource.updatedAt),
  timeRead: Duration.fromObject(storeSource.timeRead),
});
