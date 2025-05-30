import * as React from "react";
import { useShallow } from "zustand/react/shallow";

import type { TimeTrackerApi, TrackerState } from "../types/tracker.ts";
import { createTracker } from "./index.ts";

export const TimeTrackerContext = React.createContext<TimeTrackerApi | null>(
  null,
);

export function TimeTrackerProvider({ children }: React.PropsWithChildren) {
  const [timeTrackerApi] = React.useState<TimeTrackerApi>(() => {
    return createTracker();
  });

  return (
    <TimeTrackerContext.Provider value={timeTrackerApi}>
      {children}
    </TimeTrackerContext.Provider>
  );
}

export const useTimeTracker = () => {
  const context = React.useContext(TimeTrackerContext);
  if (!context) {
    throw new Error("useTimeTracker must be used within a TimeTrackerProvider");
  }
  return context;
};

export const useTimeTrackerStore = <Selected,>(
  selector: (state: TrackerState) => Selected,
) => {
  const tracker = useTimeTracker();
  return tracker.store(useShallow(selector));
};
