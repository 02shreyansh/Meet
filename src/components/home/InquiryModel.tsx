import 'react-native-get-random-values'
import { View, Text, Alert, Modal, TouchableWithoutFeedback, Keyboard, KeyboardAvoidingView, Platform, ScrollView, TextInput, TouchableOpacity } from 'react-native'
import React, { useEffect, useState } from 'react'
import { useUserStore } from "../../service/userStore";
import { inquiryStyles } from "../../styles/inquiryStyles"
import { v4 as uuidv4 } from "uuid";
interface InquiryModelProps {
    visible: boolean;
    onClose: () => void;
}

const InquiryModel: React.FC<InquiryModelProps> = ({ visible, onClose }) => {
    const { setUser, user } = useUserStore() as { setUser: Function, user: { name: string, photo: string } | null };
    const [name, setName] = useState("");
    const [profilePhotoUrl, setProfilePhotoUrl] = useState("");

    useEffect(() => {
        if (visible) {
            const storedName = user?.name;
            const storedProfilePhotoUrl = user?.photo;
            setName(storedName || "");
            setProfilePhotoUrl(storedProfilePhotoUrl || "");
        }
    }, [])
    const handleSave = () => {
        if (name && profilePhotoUrl) {
            setUser({
                id: uuidv4(),
                name,
                photo: profilePhotoUrl
            });
            onClose();
        }
        else {
            Alert.alert("Please fill all the fields");
        }
    }
    return (
        <Modal
            visible={visible}
            transparent={true}
            animationType="slide"
            onRequestClose={onClose}
        >
            <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                <View style={inquiryStyles.modalContainer}>
                    <KeyboardAvoidingView
                        behavior={Platform.OS === 'ios' ? 'padding' : "height"}
                        style={inquiryStyles.keyboardAvoidingView}
                    >

                        <ScrollView contentContainerStyle={inquiryStyles.scrollViewContent}>
                            <View style={inquiryStyles.modalContent}>
                                <Text style={inquiryStyles.title}>Enter Your Details</Text>
                                <TextInput
                                    style={inquiryStyles.input}
                                    placeholder='Enter Your Name'
                                    value={name}
                                    onChangeText={setName}
                                    placeholderTextColor={'#ccc'}
                                />
                                <TextInput
                                    style={inquiryStyles.input}
                                    placeholder='Enter Your profile photo url'
                                    value={profilePhotoUrl}
                                    onChangeText={setProfilePhotoUrl}
                                    placeholderTextColor={'#ccc'}
                                />
                                <View style={inquiryStyles.buttonContainer}>
                                    <TouchableOpacity onPress={handleSave} style={inquiryStyles.button}>
                                        <Text style={inquiryStyles.buttonText}>Save</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity onPress={onClose} style={[inquiryStyles.button,inquiryStyles.cancelButton]}>
                                        <Text style={inquiryStyles.buttonText}>Cancel</Text>
                                    </TouchableOpacity>
                                </View>
                            </View>
                        </ScrollView>
                    </KeyboardAvoidingView>
                </View>
            </TouchableWithoutFeedback>

        </Modal>
    )
}

export default InquiryModel