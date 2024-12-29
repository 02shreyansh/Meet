import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { mmkvStorage } from './Storage';

export const useUserStore = create()(
    persist(
        (set, get) => ({}),
        {
            name:"user_storage",
            storage:createJSONStorage(()=>mmkvStorage)
        }
    )
);