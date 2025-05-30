import { deserialize, serialize } from "seroval";

import type { CrudService, StorageInterface } from "../types/service.ts";
import type {
  CreateTrackerCategoryDto,
  TrackerCategory,
} from "../types/tracker.ts";

export const CATEGORY_SERVICE_STORAGE_KEY = "trackerCategories";

const CategoryStorage: StorageInterface<TrackerCategory[]> = {
  /**
   * Saves the provided tracker categories to local storage.
   * @param categories - An array of tracker categories to save.
   */
  save: async (categories) => {
    const serializedCategories = serialize(categories);
    localStorage.setItem(CATEGORY_SERVICE_STORAGE_KEY, serializedCategories);
  },

  /**
   * Retrieves tracker categories from local storage.
   * If no categories are found, or an error occurs, returns an empty array.
   * @returns A promise that resolves to an array of tracker categories.
   */
  get: async () => {
    const serializedCategories = localStorage.getItem(
      CATEGORY_SERVICE_STORAGE_KEY,
    );
    if (!serializedCategories) {
      return [];
    }
    try {
      return deserialize(serializedCategories) as TrackerCategory[];
    } catch (error) {
      console.error("Failed to deserialize tracker categories:", error);
      return [];
    }
  },
};

export const CategoryService: CrudService<
  TrackerCategory,
  CreateTrackerCategoryDto
> = {
  /**
   * Creates a new tracker category.
   * @param category - The tracker category to create.
   * @returns A promise that resolves to the created tracker category.
   */
  create: async (category) => {
    const categories = await CategoryStorage.get();
    const newCategory = {
      ...category,
      id: crypto.randomUUID(),
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    categories.push(newCategory);
    await CategoryStorage.save(categories);
    return newCategory;
  },

  /**
   * Reads a tracker category by its ID.
   * @param id - The ID of the tracker category to read.
   * @returns A promise that resolves to the tracker category or null if not found.
   */
  read: async (id) => {
    const categories = await CategoryStorage.get();
    const category = categories.find((cat) => cat.id === id);
    return category || null;
  },

  /**
   * Updates a tracker category by its ID.
   * @param id - The ID of the tracker category to update.
   * @param category - The updated tracker category data.
   */
  update: async (id, category) => {
    const categories = await CategoryStorage.get();
    const index = categories.findIndex((cat) => cat.id === id);
    if (index === -1) {
      return null;
    }
    categories[index] = {
      ...categories[index],
      ...category,
      updatedAt: new Date(),
    };
    await CategoryStorage.save(categories);
    return categories[index];
  },

  /**
   * Deletes a tracker category by its ID.
   * @param id - The ID of the tracker category to delete.
   */
  delete: async (id) => {
    const categories = await CategoryStorage.get();
    const updatedCategories = categories.filter((cat) => cat.id !== id);
    await CategoryStorage.save(updatedCategories);
  },

  /**
   * Lists all tracker categories stored in local storage.
   * If no categories are found, returns an empty array.
   */
  list: async () => {
    return await CategoryStorage.get();
  },
};
