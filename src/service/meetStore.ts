import { create } from "zustand";
import {  createJSONStorage } from "zustand/middleware";
import { mmkvStorage } from './Storage';

export const useLiveMeetStore = create((set, get) => ({
    name: "live-meet-storage",
    storage: createJSONStorage(() => mmkvStorage)
}));