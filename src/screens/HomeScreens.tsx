import { View, Text, TouchableOpacity, Alert, FlatList, Image } from 'react-native'
import React from 'react'
import { homeStyles } from '../styles/homeStyles'
import HomeHeader from '../components/home/HomeHeader'
import { navigate } from '../utils/NavigationUtils'
import { Calendar, Video } from 'lucide-react-native'
import { RFValue } from 'react-native-responsive-fontsize'
import { useUserStore } from '../service/userStore'
import { useWS } from '../api/WSProvider'
import { useLiveMeetStore } from '../service/meetStore'
import { Colors } from '../utils/Constants'
import { addHyphens } from '../utils/Helpers'


const HomeScreens = () => {
  const { emit } = useWS();
  const { user, sessions, addSession, removeSession } = useUserStore();
  // const {addSessionId,removeSessionId} =useLiveMeetStore();
  const handleNavigation = () => {
    const storedName = user?.name;
    if (!storedName) {
      Alert.alert('Please enter your name to join the meeting');
      return;
    }
    navigate('joinMeetScreen')

  }
  const renderSessions = ({ item }: { item: string }) => {
    return (
      <View style={homeStyles.sessionContainer} >
        <Calendar size={RFValue(20)} color={Colors.primary} />
        <View style={homeStyles.sessionTextContainer}>
          <Text style={homeStyles.sessionTitle}>
            {addHyphens(item)}
          </Text>
        </View>
      </View>
    )
  }

  return (
    <View style={homeStyles.container}>
      <HomeHeader />
      <FlatList
        data={sessions}
        renderItem={renderSessions}
        keyExtractor={(item: string) => item}
        ListEmptyComponent={
          <>
            <Image source={require('../assets/images/bg.png')} style={homeStyles.img} />
            <Text style={homeStyles.title}>Video Calls and Meetings for Everyone</Text>
            <Text style={homeStyles.subTitle}>
              Start a video call with friends, family, and colleagues with just one click
            </Text>
          </>
        }

      />
      <TouchableOpacity
        style={homeStyles.absoluteButton}
        onPress={handleNavigation}>
        <Video size={RFValue(14)} color={"#fff"} />
        <Text style={homeStyles.buttonText}>Join</Text>
      </TouchableOpacity>
    </View>
  )
}

export default HomeScreens