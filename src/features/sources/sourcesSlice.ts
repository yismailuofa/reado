import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { DateTime, Duration } from "luxon";
import { DBSource, db } from "../../db";
import { Source, Status } from "../../interfaces";
import type { RootState } from "../../store";

export interface SourcesState {
  sources: DBSource[];
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
        source.updatedAt = DateTime.now().toObject();
      }
    });
  },
});

export default sourcesSlice.reducer;

export const sourcesSelector = (state: RootState) => state.sources.sources;

export const loadSources = createAsyncThunk("sources/loadSources", async () => {
  const sources = await db.sources.toArray();
  return sources;
});

export const addSource = createAsyncThunk(
  "sources/addSource",
  async (source: DBSource) => {
    const id = await db.sources.add(source);
    return { ...source, id };
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

export const dbSourceToSource = (dbSource: DBSource): Source => ({
  ...dbSource,
  id: dbSource.id!,
  createdAt: DateTime.fromObject(dbSource.createdAt),
  updatedAt: DateTime.fromObject(dbSource.updatedAt),
  timeRead: Duration.fromObject(dbSource.timeRead),
});
