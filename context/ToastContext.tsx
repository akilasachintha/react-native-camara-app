import React, {createContext, ReactNode, useContext, useState} from 'react';
import {Animated, StyleSheet, Text, View} from 'react-native';
import {THEME} from '@theme/theme';
import Constants from 'expo-constants';

interface ToastContextType {
    showToast: (message: string) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

const statusBarHeight: number = Constants.statusBarHeight;

export function useToast(): ToastContextType {
    const context = useContext(ToastContext);
    if (!context) {
        throw new Error('useToast must be used within a ToastProvider');
    }
    return context;
}

interface ToastProviderProps {
    children: ReactNode;
}

export const ToastProvider: React.FC<ToastProviderProps> = ({children}) => {
    const [toastVisible, setToastVisible] = useState(false);
    const [toastMessage, setToastMessage] = useState('');

    const showToast = (message: string) => {
        const formattedMessage = message
            .split(' ')
            .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
            .join(' ');

        setToastMessage(formattedMessage);
        setToastVisible(true);

        setTimeout(() => {
            hideToast();
        }, 2000);
    };

    const hideToast = () => {
        setToastVisible(false);
    };

    const value: ToastContextType = {
        showToast,
    };

    return (
        <ToastContext.Provider value={value}>
            {children}
            {toastVisible && (
                <Animated.View style={styles.mainContainer}>
                    <View style={styles.toastContainer}>
                        <Text style={styles.toastText}>{toastMessage}</Text>
                    </View>
                </Animated.View>
            )}
        </ToastContext.Provider>
    );
};

const styles = StyleSheet.create({
    mainContainer: {
        position: 'absolute',
        alignItems: 'center',
        top: statusBarHeight + 10,
        justifyContent: 'center',
        width: '100%',
    },
    toastContainer: {
        backgroundColor: THEME.COLORS.primary,
        width: '90%',
        paddingBottom: '3%',
        paddingTop: '3%',
        borderRadius: 40,
        alignItems: 'center',
    },
    toastText: {
        color: 'white',
        fontSize: 14,
    },
});