import { View,StyleSheet, Image} from 'react-native'
import {screenHeight,screenWidth} from "../utils/Constants"
import { useEffect } from 'react'
import { resetAndNavigate } from '../utils/NavigationUtils'

const SplashScreen = () => {
  useEffect(()=>{
    const timerId=setTimeout(()=>{
      resetAndNavigate('HomeScreens')
    },1200);
    return ()=>clearTimeout(timerId);
  },[])
  return (
    <View style={styles.container}>
      <Image source={require('../assets/images/g.png')} style={styles.image}/>
    </View>
  )
}
const styles = StyleSheet.create({
  container:{
    flex:1,
    backgroundColor:'#fff',
    justifyContent:'center',
    alignItems:'center'
  },
  image:{
    width:screenWidth* 0.7,
    height:screenHeight*0.7,
    resizeMode:'contain'
  }
})
export default SplashScreen