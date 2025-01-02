import { View, Text, SafeAreaView, TouchableOpacity, TextInput, Alert } from 'react-native'
import React, { useState } from 'react'
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
import Animated, { interpolateColor, useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';
const JoinMeetScreen = () => {
  const [code, setCode] = useState("");
  const { emit } = useWS();
  const { addSessionId, removeSessionId } = useLiveMeetStore();
  const { user, addSession, removeSession } = useUserStore() as any;
  const gradientValue = useSharedValue(0);
  const animatedGradientStyle = useAnimatedStyle(() => {
    const backgroundColor = interpolateColor(
      gradientValue.value,
      [0, 1],
      ['#007AFF', '#A6C8FF']
    );
    return {
      backgroundColor,
    };
  });
  const handlePress = async() => {
    gradientValue.value = withTiming(gradientValue.value === 0 ? 1 : 0, { duration: 500 });
    const sessionId=await createSession();
    if(sessionId){
      addSession(sessionId);
      addSessionId(sessionId);
      emit('prepare-session',{
        userId:user?.id,
        sessionId
      });
      navigate('PrepareMeetScreen');
    }

  };
  const joinViaSessionId=async()=>{
    const isAvailable=await checkSession(code);
    if(isAvailable){
      emit('prepare-session',{
        userId:user?.id,
        sessionId:removeHyphens(code)
      });
      addSession(code);
      addSessionId(code);
      navigate('PrepareMeetScreen');
    }else {
      removeSession(code);
      removeSessionId(code);
      setCode("");
      Alert.alert('There is No Meeting with this Code');
    }
  }
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

      <Animated.View style={[joinStyles.gradientButton, animatedGradientStyle]}>
        <TouchableOpacity style={joinStyles.button} activeOpacity={0.7} onPress={handlePress}>
          <Video size={RFValue(22)} color={"#fff"} />
          <Text style={joinStyles.buttonText}>Create New Meet</Text>
        </TouchableOpacity>
      </Animated.View>
      <Text style={joinStyles.orText}>OR</Text>
      <View style={joinStyles.inputContainer}>
        <Text style={joinStyles.labelText}>Enter the Code</Text>
        <TextInput
          style={joinStyles.inputBox}
          value={code}
          onChangeText={setCode}
          returnKeyLabel='Join'
          returnKeyType='join'
          onSubmitEditing={() => joinViaSessionId()}
          placeholder='Example: abc-mnop-xyz'
          placeholderTextColor={"#888"}
        />
        <Text style={joinStyles.noteText}>
          Note: This meeting is secured with cloud encryption but not end-to-end encryption <Text style={joinStyles.linkText}>Learn More</Text>
        </Text>
      </View>

    </View>
  )
}

export default JoinMeetScreen