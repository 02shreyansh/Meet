import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { mmkvStorage } from './Storage';
import { MediaStream } from "react-native-webrtc";

interface LiveMeetState {
    sessionId: string | null;
    participants: { userId: string }[];
    chatMessages: string[];
    micOn: boolean;
    videoOn: boolean;
    addSessionId: (id: string|null) => void;
    removeSessionId: (id:string) => void;
    addParticipant: (participant: { userId: string }) => void;
    removeParticipant: (userId: string) => void;
    updateParticipant: (participant: { userId: string, micOn: boolean, videoOn: boolean }) => void;
    setStreamUrl:(participantId:string,streamUrl:string | MediaStream)=>void;
    toggle:(type:string)=>void;
    clear: () => void;
    
}

export const useLiveMeetStore = create<LiveMeetState, [["zustand/persist", unknown]]>(
    persist(
        (set, get) => ({
            sessionId: null,
            participants: [],
            chatMessages: [],
            micOn: false,
            videoOn: false,
            addSessionId: (id: string|null) => {
                set({ sessionId: id });
            },
            removeSessionId: (id:string) => {
                set({ sessionId: null });
            },
            addParticipant: (participant: { userId: string }) => {
                const { participants } = get();
                if (!participants.find(p => p.userId === participant?.userId)) {
                    set({ participants: [...participants, participant] });
                }
            },
            removeParticipant: (participantId: string) => {
                const { participants } = get();
                set({
                    participants: participants.filter(p => p.userId !== participantId)
                });
            },
            updateParticipant: (updatedparticipant: { userId: string, micOn: boolean, videoOn: boolean }) => {
                const { participants } = get();
                set({
                    participants: participants.map(p => p.userId === updatedparticipant?.userId ? {
                        ...p,
                        micOn: updatedparticipant?.micOn,
                        videoOn: updatedparticipant?.videoOn
                    } :
                        p
                    ),
                });
            },
            setStreamUrl:(participantId:string,streamUrl:string|MediaStream)=>{
                const { participants } = get();
                const updatedparticipants=participants.map(p=>{
                    if(p.userId===participantId){
                        return{...p,streamUrl}
                    }
                    return p;
                });
                set({participants:updatedparticipants});
            },
            toggle:(type:string)=>{
                if(type==='mic'){
                    set((state)=>({micOn:!state.micOn}));
                } else if(type==='video'){
                    set((state)=>({videoOn:!state.videoOn}));
                }
            },
            clear: () => set({ sessionId: null, participants: []}),
        }),
        {
            name: "live-meet-storage",
            storage: createJSONStorage(() => mmkvStorage)
        }
    )
);

