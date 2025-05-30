import type { WritableDraft } from "immer";
import type { UseBoundStore } from "zustand/react";
import type { StoreApi } from "zustand/vanilla";

export type Store<State> = UseBoundStore<StoreApi<State>>;
export type StoreUpdater<State> = (
  updater: (draft: WritableDraft<State>) => void,
) => void;
