import { View, Text, StyleSheet } from 'react-native'
import React from 'react'
import { useContainerDimension } from '../hooks/useContainerDimension'
import { useWebRTC } from '../hooks/useWebRTC';
import MeetHeader from '../components/meet/MeetHeader';
import UserView from '../components/meet/UserView';
import People from '../components/meet/People';
import NoUserInvite from '../components/meet/NoUserInvite';
import MeetFooter from '../components/meet/MeetFooter';
import { peopleData } from '../utils/dummyData';
// react-native-incall manager
const LiveMeetScreen = () => {
  const {containerDimensions,onContainerLayout}=useContainerDimension();
  const {participants,localStream,toggleMic,toggleVideo,switchCamera} =useWebRTC();
  return (
    <View style={styles.container}>
      <MeetHeader switchCamera={switchCamera}/>
      <View style={styles.peopleContainer} onLayout={onContainerLayout}>
        {containerDimensions && localStream && (
          <UserView
          localStream={localStream}
          containerDimensions={containerDimensions}
          />
        )}
        {
          participants.length>0 ? (
            <People
            people={participants}
            containerDimensions={containerDimensions}
            />
          ): (
            <NoUserInvite/>
          )
        }
      </View>
      <MeetFooter toggleMic={toggleMic} toggleVideo={toggleVideo} />
    </View>
  )
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121212'
  },
  peopleContainer:{
    flex:1,
  }
})
export default LiveMeetScreen