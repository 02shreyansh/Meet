import { View, Text, StyleSheet, Platform, SafeAreaView, Dimensions } from 'react-native'
import React from 'react'
import { useLiveMeetStore } from '../../service/meetStore'
import LinearGradient from 'react-native-linear-gradient'
import { addHyphens } from '../../utils/Helpers'
import { SwitchCamera, Volume2 } from 'lucide-react-native'

const { width } = Dimensions.get('window')

const MeetHeader = ({ switchCamera }: any) => {
    const { sessionId } = useLiveMeetStore();
    return (
        <LinearGradient 
            colors={['#000', 'rgba(0,0,0,0.7)', 'transparent']} 
            style={styles.container}
        >
            <SafeAreaView style={styles.safeArea}>
                <View style={styles.header}>
                    <Text style={styles.meetCode}>{addHyphens(sessionId)}</Text>
                    <View style={styles.icons}>
                        <SwitchCamera 
                            onPress={switchCamera} 
                            color={"#fff"} 
                            size={width < 375 ? 20 : 24}
                        />
                        <Volume2 
                            color={"#fff"} 
                            size={width < 375 ? 20 : 24} 
                            style={styles.iconSpacing}
                        />
                    </View>
                </View>
            </SafeAreaView>
        </LinearGradient>
    )
}

const styles = StyleSheet.create({
    container: {
        width: '100%',
        position: 'absolute',
        top: 0,
        zIndex: 1000,
    },
    safeArea: {
        width: '100%',
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: width < 375 ? 12 : 16,
        paddingBottom: width < 375 ? 20 : 30,
        paddingTop: Platform.select({
            ios: width < 375 ? 8 : 12,
            android: width < 375 ? 16 : 20,
        }),
    },
    meetCode: {
        color: '#fff',
        fontSize: width < 375 ? 16 : 18,
        fontWeight: '500',
        flex: 1,
    },
    icons: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    iconSpacing: {
        marginLeft: width < 375 ? 16 : 20,
    }
})

export default MeetHeader