import { View, Text, SafeAreaView, TouchableOpacity } from 'react-native'
import React, { useEffect, useState } from 'react'
import { useUserStore } from '../../service/userStore';
import InquiryModel from './InquiryModel';
import { headerStyles } from '../../styles/headerStyles';
import { CircleUser, Menu } from "lucide-react-native";
import { RFValue } from 'react-native-responsive-fontsize';
import { Colors } from '../../utils/Constants';
import { navigate } from '../../utils/NavigationUtils';

const HomeHeader = () => {
    const [visible, setVisible] = useState(false);
    const { user } = useUserStore() as any;
    useEffect(() => {
        const checkUserName = () => {
            const storedName = user?.name;
            if (!storedName) {
                setVisible(true);
            }
        };
        checkUserName();
    }, []);
    const handleNavigation = () => {
        const storedName = user?.name;
        if (!storedName) {
            setVisible(true);
            return;
        }
        navigate('JoinMeetScreen')

    }
    return (
        <>
            <SafeAreaView />
            <View style={headerStyles.container}>
                <Menu size={RFValue(20)} color={Colors.text} />
                <TouchableOpacity style={headerStyles.textContainer} onPress={handleNavigation}>
                    <Text style={headerStyles.placeholderText}>Enter Your meeting code</Text>
                </TouchableOpacity>
                <CircleUser
                    onPress={() => setVisible(true)}
                    size={RFValue(20)}
                    color={Colors.primary}
                />

            </View>
            <InquiryModel onClose={() => setVisible(false)} visible={visible} />
        </>
    )
}

export default HomeHeader