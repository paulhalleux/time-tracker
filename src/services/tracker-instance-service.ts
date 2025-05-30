import { deserialize, serialize } from "seroval";

import type { CrudService, StorageInterface } from "../types/service.ts";
import type {
  CreateTrackerInstanceDto,
  TrackerInstance,
} from "../types/tracker.ts";

export const TRACKER_INSTANCE_SERVICE_STORAGE_KEY = "tracker-instances";

const TrackerInstanceStorage: StorageInterface<
  Record<string, TrackerInstance[]>
> = {
  /**
   * Saves the provided tracker instances to local storage.
   * @param instances - An array of tracker instances to save.
   */
  save: async (instances) => {
    const serializedInstances = serialize(instances);
    localStorage.setItem(
      TRACKER_INSTANCE_SERVICE_STORAGE_KEY,
      serializedInstances,
    );
  },

  /**
   * Retrieves tracker instances from local storage.
   * If no instances are found, or an error occurs, returns an empty object.
   * @returns A promise that resolves to an array of tracker instances.
   */
  get: async () => {
    const serializedInstances = localStorage.getItem(
      TRACKER_INSTANCE_SERVICE_STORAGE_KEY,
    );
    if (!serializedInstances) {
      return {};
    }
    try {
      return deserialize(serializedInstances) as Record<
        string,
        TrackerInstance[]
      >;
    } catch (error) {
      console.error("Failed to deserialize tracker instances:", error);
      return {};
    }
  },
};

export const TrackerInstanceService: CrudService<
  TrackerInstance,
  CreateTrackerInstanceDto
> & {
  getByTrackerId: (trackerId: string) => Promise<TrackerInstance[]>;
} = {
  /**
   * Creates a new tracker instance.
   * @param instance - The tracker instance to create.
   * @returns A promise that resolves to the created tracker.
   */
  create: async (instance) => {
    const instances = await TrackerInstanceStorage.get();
    const newTrackerInstance: TrackerInstance = {
      ...instance,
      id: crypto.randomUUID(),
      startTime: new Date(),
      duration: 0,
    };

    if (!instances[newTrackerInstance.trackerId]) {
      instances[newTrackerInstance.trackerId] = [];
    }

    instances[newTrackerInstance.trackerId].push(newTrackerInstance);
    await TrackerInstanceStorage.save(instances);
    return newTrackerInstance;
  },

  /**
   * Reads a tracker instance by its ID.
   * @param id - The ID of the tracker instance to read.
   * @returns A promise that resolves to the tracker instance or null if not found.
   */
  read: async (id) => {
    const instances = await TrackerInstanceStorage.get();
    const allInstances = Object.values(instances).flat();
    const instance = allInstances.find((cat) => cat.id === id);
    return instance || null;
  },

  /**
   * Updates a tracker instance by its ID.
   * @param id - The ID of the tracker to update.
   * @param tracker - The updated tracker data.
   */
  update: async (id, tracker) => {
    const trackers = await TrackerInstanceStorage.get();
    if (!tracker.trackerId) {
      throw new Error("Tracker ID is required for update.");
    }

    if (!trackers[tracker.trackerId]) {
      throw new Error(`Tracker with ID ${tracker.trackerId} does not exist.`);
    }

    const trackerInstances = trackers[tracker.trackerId];

    const index = trackerInstances.findIndex((cat) => cat.id === id);
    if (index === -1) {
      return null;
    }
    trackerInstances[index] = {
      ...trackerInstances[index],
      ...tracker,
    };
    await TrackerInstanceStorage.save(trackers);
    return trackerInstances[index];
  },

  /**
   * Deletes a tracker instance by its ID.
   * @param id - The ID of the tracker instance to delete.
   */
  delete: async (id) => {
    const trackers = await TrackerInstanceStorage.get();
    const allInstances = Object.values(trackers).flat();

    const instance = allInstances.find((cat) => cat.id === id);
    if (!instance) {
      throw new Error(`Tracker instance with ID ${id} does not exist.`);
    }

    const trackerInstances = trackers[instance.trackerId];
    trackers[instance.trackerId] = trackerInstances.filter(
      (cat) => cat.id !== id,
    );

    await TrackerInstanceStorage.save(trackers);
  },

  /**
   * Lists all tracker instances stored in local storage.
   * If no trackers are found, return an empty array.
   */
  list: async () => {
    return Object.values(await TrackerInstanceStorage.get()).flat();
  },

  /**
   * Retrieves tracker instances by tracker ID.
   * @param trackerId - The ID of the tracker to retrieve instances for.
   * @returns A promise that resolves to an array of tracker instances for the specified tracker ID.
   */
  getByTrackerId: async (trackerId) => {
    const instances = await TrackerInstanceStorage.get();
    return instances[trackerId] || [];
  },
};
