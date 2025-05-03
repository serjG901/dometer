import { create } from "zustand";
import { persist } from "zustand/middleware";

interface State {
  startTime: number;
  isDoing: boolean;
  doTimes: [number, number][];
  startDoing: () => void;
  endDoing: () => void;
  deleteDoTimes: () => void;
}

const useDometerStore = create<State>()(
  persist(
    (set, get) => ({
      startTime: 0,
      isDoing: false,
      doTimes: [],
      startDoing: () => {
        if (!get().isDoing) set({ startTime: Date.now(), isDoing: true });
      },
      endDoing: () => {
        if (get().isDoing)
          set((state) => ({
            doTimes: [...state.doTimes, [state.startTime, Date.now()]],
            isDoing: false,
            startTime: 0,
          }));
      },
      deleteDoTimes: () => set({ doTimes: [], isDoing: false, startTime: 0 }),
    }),
    { name: "dometerStore" }
  )
);

export default useDometerStore;
