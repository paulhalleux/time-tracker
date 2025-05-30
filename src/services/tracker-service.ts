import { deserialize, serialize } from "seroval";

import type { CrudService, StorageInterface } from "../types/service.ts";
import type { CreateTrackerDto, Tracker } from "../types/tracker.ts";

export const TRACKER_SERVICE_STORAGE_KEY = "trackers";

const TrackerStorage: StorageInterface<Tracker[]> = {
  /**
   * Saves the provided trackers to local storage.
   * @param trackers - An array of trackers to save.
   */
  save: async (trackers) => {
    const serializedTrackers = serialize(trackers);
    localStorage.setItem(TRACKER_SERVICE_STORAGE_KEY, serializedTrackers);
  },

  /**
   * Retrieves trackers from local storage.
   * If no trackers are found, or an error occurs, returns an empty array.
   * @returns A promise that resolves to an array of trackers.
   */
  get: async () => {
    const serializedTrackers = localStorage.getItem(
      TRACKER_SERVICE_STORAGE_KEY,
    );
    if (!serializedTrackers) {
      return [];
    }
    try {
      return deserialize(serializedTrackers) as Tracker[];
    } catch (error) {
      console.error("Failed to deserialize trackers:", error);
      return [];
    }
  },
};

export const TrackerService: CrudService<Tracker, CreateTrackerDto> = {
  /**
   * Creates a new tracker.
   * @param tracker - The tracker to create.
   * @returns A promise that resolves to the created tracker.
   */
  create: async (tracker) => {
    const trackers = await TrackerStorage.get();
    const newTracker = {
      ...tracker,
      id: crypto.randomUUID(),
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    trackers.push(newTracker);
    await TrackerStorage.save(trackers);
    return newTracker;
  },

  /**
   * Reads a tracker by its ID.
   * @param id - The ID of the tracker to read.
   * @returns A promise that resolves to the tracker or null if not found.
   */
  read: async (id) => {
    const trackers = await TrackerStorage.get();
    const tracker = trackers.find((cat) => cat.id === id);
    return tracker || null;
  },

  /**
   * Updates a tracker by its ID.
   * @param id - The ID of the tracker to update.
   * @param tracker - The updated tracker data.
   */
  update: async (id, tracker) => {
    const trackers = await TrackerStorage.get();
    const index = trackers.findIndex((cat) => cat.id === id);
    if (index === -1) {
      return null;
    }
    trackers[index] = {
      ...trackers[index],
      ...tracker,
      updatedAt: new Date(),
    };
    await TrackerStorage.save(trackers);
    return trackers[index];
  },

  /**
   * Deletes a tracker by its ID.
   * @param id - The ID of the tracker to delete.
   */
  delete: async (id) => {
    const trackers = await TrackerStorage.get();
    const updatedTrackers = trackers.filter((cat) => cat.id !== id);
    await TrackerStorage.save(updatedTrackers);
  },

  /**
   * Lists all tracker stored in local storage.
   * If no trackers are found, return an empty array.
   */
  list: async () => {
    return await TrackerStorage.get();
  },
};
