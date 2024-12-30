import { View, Text, SafeAreaView, TouchableOpacity } from 'react-native'
import React from 'react'
import { goBack, navigate } from "../utils/NavigationUtils";
import { checkSession, createSession } from "../api/Session";
import { useWS } from "../api/WSProvider";
import { removeHyphens } from "../utils/Helpers";
import { useUserStore } from '../service/userStore';
import { useLiveMeetStore } from '../service/meetStore';
import { joinStyles } from '../styles/joinStyles'
import { ChevronLeft, EllipsisVertical, Video } from 'lucide-react-native';
import { RFValue } from 'react-native-responsive-fontsize';
import { Colors } from '../utils/Constants';
import { LinearGradient } from 'react-native-linear-gradient';
const JoinMeetScreen = () => {
  return (
    <View style={joinStyles.container}>
      <SafeAreaView />
      <View style={joinStyles.headerContainer}>
        <ChevronLeft size={RFValue(19)} color={Colors.text} onPress={() => goBack()} />
        <Text style={joinStyles.headerText}>
          Join Meet
        </Text>
        <EllipsisVertical size={RFValue(18)} color={Colors.text} />
      </View>

      <LinearGradient colors={['#007AFF', 'A6C8FF']} style={joinStyles.gradientButton}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}>
        <TouchableOpacity style={joinStyles.button} activeOpacity={0.7}>
          <Video size={RFValue(22)} color={"#fff"} />
          <Text style={joinStyles.buttonText}>Create New Meet</Text>
        </TouchableOpacity>
      </LinearGradient>

    </View>
  )
}

export default JoinMeetScreen