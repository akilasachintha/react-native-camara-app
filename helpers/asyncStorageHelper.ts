import AsyncStorage from "@react-native-async-storage/async-storage";

const addDataToLocalStorage = async (key: string, value: string): Promise<void> => {
    try {
        await AsyncStorage.setItem(key, value);
    } catch (e) {
        console.error(e);
    }
};

const getDataFromLocalStorage = async (key: string): Promise<string | null> => {
    try {
        const value = await AsyncStorage.getItem(key);
        return value !== null ? value : null;
    } catch (e) {
        console.error(e);
        return null;
    }
};

const removeDataFromLocalStorage = async (key: string): Promise<void> => {
    try {
        await AsyncStorage.removeItem(key);
    } catch (e) {
        console.error(e);
    }
};

export {addDataToLocalStorage, getDataFromLocalStorage, removeDataFromLocalStorage};