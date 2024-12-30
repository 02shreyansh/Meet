import { Alert } from "react-native";
import axios from "axios"
import { BASE_URL } from "../service/Config";
export const createSession=async()=>{
    try {
        const apiRes=await axios.post(`${BASE_URL}/create-session`);
        return apiRes?.data?.sessionId;
    } catch (error) {
        console.error("SESSION ERROR ",error);
        Alert.alert("There was an error");
        return null;
    }
}

export const checkSession=async(id: string)=>{
    try {
        const apiRes=await axios.get(`${BASE_URL}/is-alive?sessionId=${id}`);
        return apiRes?.data?.isAlive;
    } catch (error) {
        console.error("SESSION ERROR ",error);
        return false;
    }
}