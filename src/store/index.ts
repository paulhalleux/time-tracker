import { current, produce } from "immer";
import { deserialize, serialize } from "seroval";
import { create } from "zustand/react";

import { queryClient } from "../App.tsx";
import { QueryKeys } from "../constants/query-keys.ts";
import { TrackerInstanceService } from "../services/tracker-instance-service.ts";
import type { Store, StoreUpdater } from "../types/store.ts";
import type {
  TimeTrackerApi,
  TrackerInstance,
  TrackerState,
} from "../types/tracker.ts";

let initialized = false;

export function createTracker(): TimeTrackerApi {
  const store = createTrackerStore();
  const updateStore = createStoreUpdater(store);

  const setupInterval = (trackerId: string) => {
    updateStore((state) => {
      if (!state.instance) {
        return;
      }

      if (state.interval) {
        clearInterval(state.interval);
      }

      state.interval = setInterval(() => {
        updateStore((s) => {
          if (!s.instance || s.isPaused || s.instance.endTime) {
            return;
          }

          s.instance.duration = s.instance.duration + 1000;
          queryClient.setQueryData<TrackerInstance[]>(
            QueryKeys.TrackerInstances.ByTrackerId(trackerId),
            (oldData) => {
              const instances = oldData || [];
              return instances.map((i) => {
                if (i.id === s.instance?.id) {
                  return { ...i, duration: s.instance.duration };
                }
                return i;
              });
            },
          );

          TrackerInstanceService.update(s.instance.id, current(s.instance));
        });
      }, 1000);
    });
  };

  const { instance, interval, isPaused } = store.getState();
  if (instance && !instance.endTime && !isPaused && !interval && !initialized) {
    setupInterval(instance.trackerId);
    initialized = true;
  }

  const startTracking = async (trackerId: string) => {
    await stopTracking();

    const instance = await TrackerInstanceService.create({
      trackerId,
    });

    updateStore((state) => {
      state.isPaused = false;
      state.instance = instance;
    });

    setupInterval(trackerId);

    queryClient.setQueryData<TrackerInstance[]>(
      QueryKeys.TrackerInstances.ByTrackerId(trackerId),
      (oldData) => {
        const instances = oldData || [];
        return [instance, ...instances];
      },
    );
  };

  const stopTracking = async () => {
    updateStore((state) => {
      if (!state.instance) {
        return;
      }

      TrackerInstanceService.update(state.instance?.id, {
        ...current(state.instance),
        endTime: new Date(),
      }).then((updated) => {
        if (!updated) {
          return;
        }
        queryClient.setQueryData<TrackerInstance[]>(
          QueryKeys.TrackerInstances.ByTrackerId(updated.trackerId),
          (oldData) => {
            const instances = oldData || [];
            return instances.map((i) => {
              if (i.id === updated.id) {
                return updated;
              }
              return i;
            });
          },
        );
      });

      state.isPaused = false;
      state.instance = null;
      if (state.interval) {
        clearInterval(state.interval);
        state.interval = null;
      }
    });
  };

  return {
    store,
    updateStore,

    startTracking,
    stopTracking,
    pause: async () => {
      updateStore((state) => {
        state.isPaused = true;
        if (state.interval) {
          clearInterval(state.interval);
          state.interval = null;
        }
      });
    },
    resume: async () => {
      const { instance } = store.getState();
      if (!instance) {
        return;
      }

      updateStore((state) => {
        state.isPaused = false;
      });

      setupInterval(instance.trackerId);
    },
  };
}

const DEFAULT_TRACKER_STATE: TrackerState = {
  isPaused: false,
  instance: null,
  interval: null,
};

function createTrackerStore() {
  const storedState = localStorage.getItem("trackerState");
  return create<TrackerState>(() => {
    return storedState ? deserialize(storedState) : DEFAULT_TRACKER_STATE;
  });
}

function createStoreUpdater(
  store: Store<TrackerState>,
): StoreUpdater<TrackerState> {
  return (updater) => {
    store.setState(produce(updater));
    localStorage.setItem(
      "trackerState",
      serialize({
        ...store.getState(),
        interval: null,
      }),
    );
  };
}
