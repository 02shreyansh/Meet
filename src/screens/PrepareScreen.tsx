import { View, Text, ScrollView, Image, TouchableOpacity } from 'react-native'
import React, { useEffect, useState } from 'react'
import { useWS } from '../api/WSProvider'
import { useLiveMeetStore } from '../service/meetStore';
import { MediaStream, RTCView, mediaDevices } from "react-native-webrtc";
import { prepareStyles } from "../styles/prepareStyles";
import { addHyphens, requestPermissions } from '../utils/Helpers';
import { useUserStore } from '../service/userStore';
import { goBack, replace } from '../utils/NavigationUtils';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ChevronLeft, EllipsisVertical, Info, Mic, MicOff, MonitorUp, Share, Shield, Video, VideoOff } from 'lucide-react-native';
import { RFValue } from 'react-native-responsive-fontsize';
import { Colors } from '../utils/Constants';

const PrepareScreen = () => {
  const { emit, on, off } = useWS();
  const { addParticipant, sessionId, addSessionId, micOn, videoOn, toggle } = useLiveMeetStore();
  const { user } = useUserStore() as any;
  const [localStream, setLocalStream] = useState<MediaStream | null>(null);
  const [participants, setParticipants] = useState([]);
  useEffect(() => {
    const handleParticipantsUpdate = (updatedParticipants: any) => {
      setParticipants(updatedParticipants?.participants);
    };
    on("session-info", handleParticipantsUpdate);
    return () => {
      if (localStream) {
        localStream.getTracks().forEach((track: any) => track.stop());
        localStream?.release();
      }
      setLocalStream(null);
      off("session-info");
    }
  }, [sessionId, emit, on, off]);
  const toggleMicState = (newState: any) => {
    if (localStream) {
      const audioTrack = localStream.getAudioTracks()[0];
      if (audioTrack) {
        audioTrack.enabled = newState;
      }
    }
  }
  const toggleVideoState = (newState: any) => {
    if (localStream) {
      const videoTrack = localStream.getVideoTracks()[0];
      if (videoTrack) {
        videoTrack.enabled = newState;
      }
    }
  }
  const toggleLocal = (type: string) => {
    if (type === 'mic') {
      const newMicState = !micOn;
      toggleMicState(newMicState);
      toggle('mic');
    }
    if (type === 'video') {
      const newVideoState = !videoOn;
      toggleVideoState(newVideoState);
      toggle('video');
    }
  };
  const showMediaDevices = (audio: boolean, video: boolean) => {
    if (audio || video) {
      mediaDevices?.getUserMedia({
        audio,
        video
      }).then((stream) => {
        setLocalStream(stream);
        const audioTrack = stream?.getAudioTracks()[0];
        const videoTrack = stream?.getVideoTracks()[0];
        if (audioTrack) {
          audioTrack.enabled = audio;
        }
        if (videoTrack) {
          videoTrack.enabled = video;
        }
      }).catch((err) => {
        console.log("Error in getting media devices", err);
      })
    }
  };

  const fetchMediaPermissions = async () => {
    const result = await requestPermissions();
    if (result?.isCameraGranted) {
      toggleLocal('mic');
    }
    if (result?.isMicrophoneGranted) {
      toggleLocal('video');
    }
    showMediaDevices(result?.isMicrophoneGranted, result?.isCameraGranted);
  };
  useEffect(() => {
    fetchMediaPermissions();
  }, []);
  const handleStart = async () => {
    try {
      emit('join-session', {
        name: user?.name,
        photo: user?.photo,
        userId: user?.id,
        sessionId: sessionId,
        micOn,
        videoOn
      });
      participants.forEach((i: any) => addParticipant(i));
      addSessionId(sessionId);
      replace("LiveMeetScreen");
    } catch (error) {
      console.error("Error Starting Call: ", error);
    }
  };
  const renderParticipants = () => {
    if (participants.length === 0) {
      return 'No one is in the call yet';
    }
    const names = participants?.slice(0, 2)?.map((p: any) => p?.name)?.join(', ');
    const count = participants.length > 2 ? `and ${participants.length - 2} others` : '';
    return `${names}${count} in  the call`;
  }

  return (
    <View style={prepareStyles.container}>
      <SafeAreaView />
      <View style={prepareStyles.headerContainer}>
        <ChevronLeft
          size={RFValue(22)}
          onPress={() => {
            goBack();
            addSessionId(null);
          }}
          color={Colors.text}
        />
        <EllipsisVertical
          size={RFValue(18)}
          color={Colors.text}
        />
      </View>
      <ScrollView contentContainerStyle={{ flex: 1 }}>
        <View style={prepareStyles.videoContainer}>
          <Text style={prepareStyles.meetingCode}>
            {addHyphens(sessionId)}
          </Text>
          <View style={prepareStyles.camera}>
            {
              localStream && videoOn ? (
                <RTCView
                  streamURL={localStream?.toURL()}
                  style={prepareStyles.localVideo}
                  mirror={true}
                  objectFit="cover"
                />
              ) : (
                <Image source={{ uri: user?.photo }} style={prepareStyles.image} />
              )
            }
            <View style={prepareStyles.toggleContainer}>
              <TouchableOpacity onPress={() => toggleLocal('mic')} style={prepareStyles.iconButton}>
                {
                  micOn ? (
                    <Mic size={RFValue(12)} color={"#fff"} />
                  ) : (
                    <MicOff size={RFValue(12)} color={"#fff"} />
                  )

                }
              </TouchableOpacity>
              <TouchableOpacity onPress={() => toggleLocal('video')} style={prepareStyles.iconButton}>
                {
                  videoOn ? (
                    <Video size={RFValue(12)} color={"#fff"} />
                  ) : (
                    <VideoOff size={RFValue(12)} color={"#fff"} />
                  )
                }
              </TouchableOpacity>
            </View>
          </View>
          <TouchableOpacity style={prepareStyles.buttonContainer}>
            <MonitorUp size={RFValue(14)} color={Colors.primary} />
            <Text style={prepareStyles.buttonText}>Share Screen</Text>
          </TouchableOpacity>
          <Text style={prepareStyles.peopleText}>{renderParticipants()}</Text>
        </View>
        <View style={prepareStyles.infoContainer}>
          <View style={prepareStyles.flexRowBetween}>
            <Info size={RFValue(14)} color={Colors.text} />
            <Text style={prepareStyles.joiningText}>Joining information</Text>
            <Share size={RFValue(14)} color={Colors.text} />
          </View>
          <View style={{ marginLeft: 38 }}>
            <Text style={prepareStyles.linkHeader}>Meeting Link</Text>
            <Text style={prepareStyles.linkText}>meet.google.com/{addHyphens(sessionId)}</Text>
          </View>
          <View style={prepareStyles.flexRow}>
            <Shield size={RFValue(14)} color={Colors.text} />
            <Text style={prepareStyles.encryptionText}>Encryption</Text>
          </View>
        </View>
      </ScrollView>
      <View style={prepareStyles.joinContainer}>
        <TouchableOpacity style={prepareStyles.joinButton} onPress={handleStart}>
          <Text style={prepareStyles.joinButtonText}>Join</Text>
        </TouchableOpacity>
        <Text style={prepareStyles.noteText}>Joining as</Text>
        <Text style={prepareStyles.peopleText}>{user?.name}</Text>
      </View>
    </View>
  )
}

export default PrepareScreen