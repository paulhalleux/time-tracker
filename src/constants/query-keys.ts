export const QueryKeys = {
  Categories: {
    All: ["categories", "all"],
    ById: (id: string | undefined) => ["categories", "byId", id],
  },
  Trackers: {
    All: ["trackers", "all"],
    ById: (id: string | undefined) => ["trackers", "byId", id],
  },
  TrackerInstances: {
    ByTrackerId: (trackerId: string | undefined) => [
      "tracker-instances",
      "byTrackerId",
      trackerId,
    ],
  },
};
