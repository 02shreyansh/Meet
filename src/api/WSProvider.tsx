import { createContext, useContext, useEffect, useRef } from "react"
import { io, Socket } from "socket.io-client";
import { SOCKET_URL } from "../service/Config";
interface WSService{
    intializeSocket:()=>void
    emit:(event:string,data?:any)=>void;
    on:(event:string,cb:(data:any)=>void)=>void;
    off:(event:string)=>void;
    removeListener:(listenerName:string)=>void;
    disconnect:()=>void;
}
const WSContext = createContext<WSService | undefined>(undefined);
export const WSProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const socket = useRef<Socket>();
    useEffect(() => {
        socket.current = io(SOCKET_URL, {
            transports: ["websocket"]
        });

        return ()=>{
            socket.current?.disconnect();
        }
    }, [])

    const emit=(event:string,data:any={})=>{
        socket?.current?.emit(event,data);
    }
    const on=(event:string,cb:(data:any)=>void)=>{
        socket?.current?.on(event,cb);
    }
    const off=(event:string)=>{
        socket?.current?.off(event);
    }
    const removeListener=(listenerName:string)=>{
        socket?.current?.removeListener(listenerName);
    }

    const disconnect=()=>{
        if(socket.current){
            socket.current.disconnect();
            socket.current=undefined;
        }
    }

    const socketService:WSService={
        intializeSocket:()=>{},
        emit,
        on,
        off,
        removeListener,
        disconnect
    }
    return (
        <WSContext.Provider value={socketService}>
            {children}
        </WSContext.Provider>
    )
}

export const useWS=()=>{
    const socketService=useContext(WSContext);
    if(!socketService){
        throw new Error("useWS must be used within WSProvider");
    }
    return socketService;
}