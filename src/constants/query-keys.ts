export const QueryKeys = {
  Categories: {
    All: ["categories", "all"],
    ById: (id: string | undefined) => ["categories", "byId", id ?? "<unset>"],
  },
  Trackers: {
    All: ["trackers", "all"],
    ById: (id: string | undefined) => ["trackers", "byId", id ?? "<unset>"],
  },
  TrackerInstances: {
    ByTrackerId: (trackerId: string | undefined) => [
      "tracker-instances",
      "byTrackerId",
      trackerId,
    ],
  },
};
