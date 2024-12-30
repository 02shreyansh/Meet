import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { mmkvStorage } from './Storage';

interface UserState {
    user: string | null;
    sessions: string[];
    setUser: (data: string) => void;
    addSession: (sessionId: string) => void;
    removeSession: (sessionId: string) => void;
    clear: () => void;
}

export const useUserStore = create<UserState>()(
    persist(
        (set, get) => ({
            user:null,
            sessions:[],
            setUser:(data:string)=>{
                set({user:data});
            },
            addSession:(sessionId:string)=>{
                const {sessions} =get();
                const existingSessionIndex=sessions.findIndex((s)=>s===sessionId);
                if(existingSessionIndex===-1){
                    set({sessions:[sessionId,...sessions]});
                }
            },
            removeSession:(sessionId:string)=>{
                const {sessions} =get();
                const updatedSessions= sessions.filter((s)=>s!==sessionId);
                set({sessions:updatedSessions});
            },
            clear:()=>{
                set({user:null,sessions:[]});
            }
        }),
        {
            name:"user_storage",
            storage:createJSONStorage(()=>mmkvStorage)
        }
    )
);