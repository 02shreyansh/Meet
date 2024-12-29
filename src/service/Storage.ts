import {MMKV} from "react-native-mmkv"

export const Storage = new MMKV({
    id:'user_storage',
    encryptionKey:'user_storage_key',
});

export const mmkvStorage = {
    setItem: (key: string, value: string) => {
        Storage.set(key, value);
    },
    getItem:(key:string)=>{
        const value=Storage.getString(key);
        return value ?? null
    },
    removeItem:(key:string)=>{
        Storage.delete(key);
    },
}