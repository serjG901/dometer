import { create } from "zustand";
import { persist } from "zustand/middleware";

interface State {
  type: string;
  startTime: number;
  isDoing: boolean;
  doTimes: { type: string; start: number; end: number }[];
  setType: (type: string) => void;
  startDoing: () => void;
  endDoing: () => void;
  deleteDoTimes: () => void;
}

const useDometerStore = create<State>()(
  persist(
    (set, get) => ({
      type: "",
      startTime: 0,
      isDoing: false,
      doTimes: [],
      setType: (type) => set({ type }),
      startDoing: () => {
        if (!get().isDoing)
          set((state) => ({
            type: state.type,
            startTime: Date.now(),
            isDoing: true,
          }));
      },
      endDoing: () => {
        if (get().isDoing)
          set((state) => ({
            doTimes: [
              ...state.doTimes,
              { type: state.type, start: state.startTime, end: Date.now() },
            ],
            isDoing: false,
            startTime: 0,
          }));
      },
      deleteDoTimes: () =>
        set((state) => ({
          doTimes: state.type
            ? state.doTimes.filter((t) => t.type !== state.type)
            : [],
          isDoing: false,
          startTime: 0,
        })),
    }),
    { name: "dometerStore" }
  )
);

export default useDometerStore;
