import { useState, useEffect, useRef } from "react";
import {
    RTCPeerConnection,
    RTCSessionDescription,
    RTCIceCandidate,
    mediaDevices,
    MediaStream,
} from "react-native-webrtc";
import { useWS } from "../api/WSProvider";
import { useLiveMeetStore } from "../service/meetStore";
import { useUserStore } from "../service/userStore";
import { peerConstraints } from "../utils/Helpers";

export const useWebRTC = () => {
    const {
        participants,
        setStreamUrl,
        sessionId,
        addSessionId,
        addParticipant,
        micOn,
        videoOn,
        toggle,
        clear,
        removeParticipant,
        updateParticipant
    } = useLiveMeetStore();
    const { user } = useUserStore() as any;

    const [localStream, setLocalStream] = useState<MediaStream | null>(null);
    const { emit, on, off } = useWS();
    const peerConnections = useRef(new Map());
    const pendingCandidates = useRef(new Map());
    const startLocalStream = async () => {
        try {
            const mediaStream = await mediaDevices.getUserMedia({
                audio: true,
                video: true
            });
            setLocalStream(mediaStream);
        } catch (error) {
            console.log("Error Starting Local Stream", error);
        }
    };
    const establishPeerConnection = async () => {
        participants?.forEach(async (streamUser: any) => {
            if (!peerConnections.current.has(streamUser?.userId)) {
                const peerConnection = new RTCPeerConnection(peerConstraints);
                peerConnections.current.set(streamUser?.userId, peerConnection);

                peerConnection.ontrack = (event: any) => {
                    const remoteStream = new MediaStream();
                    event.streams[0].getTracks().forEach((track: any) => {
                        remoteStream.addTrack(track);
                    });
                    console.log("Remote Stream", remoteStream.toURL());
                    setStreamUrl(streamUser?.userId, remoteStream);
                }
                peerConnection.onicecandidate = ({ candidate }: { candidate: any }) => {
                    if (candidate) {
                        emit('send-ice-candidate', {
                            sessionId,
                            sender: user?.id,
                            receiver: streamUser?.userId,
                            candidate,
                        });
                    };
                };
                localStream?.getTracks().forEach((track: any) => {
                    peerConnection.addTrack(track, localStream);
                });

                try {
                    const offerDescription = await peerConnection.createOffer();
                    await peerConnection.setLocalDescription(offerDescription);
                    emit('send-offer', {
                        sessionId,
                        sender: user?.id,
                        receiver: streamUser?.userId,
                        offer: offerDescription,
                    });
                } catch (error) {
                    console.log("Error Creating Offer", error);
                }
            }
        })
    }
    const joiningStream = async () => {
        await establishPeerConnection();
    };
    useEffect(() => {
        if (localStream) {
            joiningStream();
        }
    }, [localStream]);
    useEffect(() => {
        startLocalStream();
        if (localStream) {
            return () => {
                localStream.getTracks().forEach((track: any) => track.stop());
            }
        }
    }, [])

    useEffect(() => {
        if (localStream) {
            on('receive-ice-candidate', handleRecieveIceCandidate);
            on('receive-offer', handleReceiveOffer);
            on('receive-answer', handleReceiveAnswer);
            on('new-participant', handleNewParticipant);
            on('participant-left', handleParticipantLeft);
            on('participant-update', handleParticipantUpdate);

            return () => {
                localStream.getTracks().forEach((track: any) => track.stop());
                peerConnections.current.forEach((pc: any) => pc.close());
                peerConnections.current.clear();
                addSessionId(null);
                clear();
                emit('hang-up');
                off('receive-ice-candidate');
                off('receive-offer');
                off('receive-answer');
                off('new-participant');
                off('participant-left');
                off('participant-update');
            }
        }
    }, [localStream]);

    const handleNewParticipant = (participant: any) => {
        if (participant?.userId === user?.id) {
            return;
        }
        addParticipant(participant);
    }

    const handleReceiveOffer = async ({sender,receiver,offer}:any) => {
        if(receiver!==user?.id){
            return;
        }
        try {
            let peerConnection = peerConnections.current.get(sender);
            if(!peerConnection){
                peerConnection=new RTCPeerConnection(peerConstraints);
                peerConnections.current.set(sender,peerConnection);

                peerConnection.ontrack=(event:any)=>{
                    const remoteStream=new MediaStream();
                    event.streams[0].getTracks().forEach((track:any)=>{
                        remoteStream.addTrack(track);
                    });
                    setStreamUrl(sender,remoteStream);
                }
                peerConnection.onicecandidate=({candidate}:any)=>{
                    if(candidate){
                        emit('send-ice-candidate',{
                            sessionId,
                            sender:receiver,
                            receiver:sender,
                            candidate,
                        });
                    }
                };
                if(pendingCandidates.current.has(sender)){
                    pendingCandidates.current.get(sender).forEach((candidate:any)=>{
                        peerConnection.addIceCandidate(new RTCIceCandidate(candidate));
                    });
                    pendingCandidates.current.delete(sender);
                };
                if(localStream){
                    localStream.getTracks().forEach((track:any)=>{
                        peerConnection.addTrack(track,localStream);
                    });
                }
            }
            await peerConnection.setRemoteDescription(new RTCSessionDescription(offer));
            const answer=await peerConnection.createAnswer();
            await peerConnection.setLocalDescription(answer);
            emit('send-answer',{
                sessionId,
                sender:receiver,
                receiver:sender,
                answer,
            });
        } catch (error) {
            console.log("Error Receiving Offer",error);
        }
    }

    const handleReceiveAnswer=({sender,receiver,answer}:any)=>{
        if(receiver!==user?.id){
            return;
        }
        const peerConnection=peerConnections.current.get(sender);
        if(peerConnection){
            peerConnection.setRemoteDescription(new RTCSessionDescription(answer));
        }
    }
    const handleRecieveIceCandidate=async({sender,receiver,candidate}:any)=>{
        if(receiver!==user?.id){
            return;
        }
        const peerConnection=peerConnections.current.get(sender);
        if(peerConnection){
            peerConnection.addIceCandidate(new RTCIceCandidate(candidate));
        }else{
            if(!pendingCandidates.current.has(sender)){
                pendingCandidates.current.set(sender,[]);
            }
            pendingCandidates.current.get(sender).push(candidate);
        }
    }
    const handleParticipantLeft=({userId}:any)=>{
        removeParticipant(userId);
        const peerConnection=peerConnections.current.get(userId);
        if(peerConnection){
            peerConnection.close();
            peerConnections.current.delete(userId);
        }
    }
    const handleParticipantUpdate=(updatedparticipant:any)=>{
        updateParticipant(updatedparticipant);
    }

    const toggleMic = () => {
        if(localStream){
            localStream?.getAudioTracks().forEach((track:any)=>{
                micOn ? (track.enabled=false):(track.enabled=true);
            });
        }
        toggle('mic');
        emit('toggle-mute',{
            sessionId,
            userId:user?.id,
        })
    }
    const toggleVideo = () => {
        if(localStream){
            localStream?.getVideoTracks().forEach((track:any)=>{
                videoOn ? (track.enabled=false):(track.enabled=true);
            });
        }
        toggle('video');
        emit('toggle-video',{
            sessionId,
            userId:user?.id,
        })
    }
    const switchCamera=()=>{
        if(localStream){
            localStream?.getVideoTracks().forEach((track:any)=>{
                track._switchCamera();
            })
        }
    };

    return {
        localStream,
        participants,
        toggleMic,
        toggleVideo,
        switchCamera,
    }
};