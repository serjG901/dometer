export interface AppState {
  type: string;
  startTime: number;
  isDoing: boolean;
  doTimes: { type: string; start: number; end: number }[];
  setType: (type: string) => void;
  startDoing: () => void;
  endDoing: () => void;
  deleteDoTimes: () => void;
}