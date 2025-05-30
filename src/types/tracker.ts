import type { Store, StoreUpdater } from "./store.ts";

/**
 * Tracker represents a time tracker entity.
 */
export type Tracker = {
  id: string;
  name: string;
  description?: string;
  categoryId?: string;
  createdAt: Date;
  updatedAt: Date;
};

/**
 * CreateTrackerDto is used to create a new tracker.
 */
export type CreateTrackerDto = Omit<Tracker, "id" | "createdAt" | "updatedAt">;

/**
 * TrackerInstance represents a specific instance of a tracker being used.
 * It includes the start and end times, duration, and maximum duration.
 */
export type TrackerInstance = {
  id: string;
  trackerId: string;
  startTime: Date;
  endTime?: Date;
  duration: number;
  maxDuration?: number;
};

/**
 * CreateTrackerInstanceDto is used to create a new tracker instance.
 */
export type CreateTrackerInstanceDto = Omit<
  TrackerInstance,
  "id" | "startTime" | "endTime" | "duration"
>;

/**
 * TrackerCategory represents a category for organizing trackers.
 * It can be used to group trackers by type or purpose.
 */
export type TrackerCategory = {
  id: string;
  name: string;
  description?: string;
  createdAt: Date;
  updatedAt: Date;
};

/**
 * TrackerCreateCategoryDto is used to create a new tracker category.
 */
export type CreateTrackerCategoryDto = Omit<
  TrackerCategory,
  "id" | "createdAt" | "updatedAt"
>;

/**
 * TimeTrackerApi provides an interface for managing time trackers.
 */
export type TimeTrackerApi = {
  store: Store<TrackerState>;
  updateStore: StoreUpdater<TrackerState>;

  /**
   * Starts tracking a specific tracker by its ID.
   * This function will set the current tracker ID in the store,
   * allowing the application to focus on that tracker for time tracking purposes.
   * It will create a new tracker instance.
   * @param trackerId - The ID of the tracker to start tracking.
   */
  startTracking: (trackerId: string) => Promise<void>;

  /**
   * Stops tracking the current tracker.
   * This function will clear the current tracker ID in the store,
   * effectively stopping any ongoing time tracking.
   */
  stopTracking: () => Promise<void>;

  /**
   * Toggles the pause state of the current tracker.
   * If the tracker is currently paused, it will resume tracking.
   * If it is currently tracking, it will pause tracking.
   */
  pause: () => Promise<void>;

  /**
   * Resumes tracking the current tracker.
   * This function will set the pause state to false,
   * allowing the application to continue tracking time.
   */
  resume: () => Promise<void>;
};

/**
 * The state of the tracker store.
 */
export type TrackerState = {
  isPaused: boolean;
  instance: TrackerInstance | null;
  interval: NodeJS.Timeout | null;
};
