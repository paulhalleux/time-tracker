/**
 * Service interface for handling CRUD operations.
 * This interface defines methods for creating, reading, updating, deleting,
 * and listing items of type T.
 */
export type CrudService<T, CreateDto = T> = {
  create: (item: CreateDto) => Promise<T>;
  read: (id: string) => Promise<T | null>;
  update: (id: string, item: Partial<T>) => Promise<T | null>;
  delete: (id: string) => Promise<void>;
  list: () => Promise<T[]>;
};

/*
 * StorageInterface defines methods for saving and retrieving items of type T.
 */
export type StorageInterface<T> = {
  save: (item: T) => Promise<void>;
  get: () => Promise<T>;
};
