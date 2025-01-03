import { View, Text, TouchableOpacity } from 'react-native'
import React from 'react'
import { useLiveMeetStore } from '../../service/meetStore'
import { inviteStyles } from '../../styles/inviteStyles';
import { addHyphens } from '../../utils/Helpers';
import { Clipboard, Share } from 'lucide-react-native';

const NoUserInvite = () => {
    const { sessionId } = useLiveMeetStore();
    return (
        <View style={inviteStyles.container}>
            <Text style={inviteStyles.headerText}>You're the only one here</Text>
            <Text style={inviteStyles.subText}>Invite others to join using this code:</Text>
            <View style={inviteStyles.linkContainer}>
                <Text style={inviteStyles.linkText}>
                    meet.google.com/{addHyphens(sessionId)}
                </Text>
                <TouchableOpacity style={inviteStyles.iconButton}>
                    <Clipboard color={"#fff"}/>
                </TouchableOpacity>
            </View>
            <TouchableOpacity style={inviteStyles.shareButton}>
                <Share color={"#000"}/>
                <Text style={inviteStyles.shareText}>Share Invite</Text>
            </TouchableOpacity>

        </View>
    )
}

export default NoUserInvite