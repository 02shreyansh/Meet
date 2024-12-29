import { NavigationContainer } from '@react-navigation/native'
import { createNativeStackNavigator } from "@react-navigation/native-stack"
import { navigationRef } from '../utils/NavigationUtils';
import SplashScreen from '../screens/SplashScreen';
import HomeScreens from '../screens/HomeScreens';
import JoinMeetScreen from '../screens/JoinMeetScreen';
import PrepareMeetScreen from '../screens/PrepareScreen';
import LiveMeetScreen from '../screens/LiveMeetScreen';

const Stack = createNativeStackNavigator();
const Navigation = () => {
  return (
    <NavigationContainer ref={navigationRef}>
      <Stack.Navigator initialRouteName='SplashScreen' screenOptions={{
        headerShown: false,
      }}>
        <Stack.Screen name='SplashScreen' component={SplashScreen} />
        <Stack.Screen name='HomeScreens' component={HomeScreens} />
        <Stack.Screen name='JoinMeetScreen' component={JoinMeetScreen} />
        <Stack.Screen name='PrepareMeetScreen' component={PrepareMeetScreen} />
        <Stack.Screen name='LiveMeetScreen' component={LiveMeetScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  )
}

export default Navigation