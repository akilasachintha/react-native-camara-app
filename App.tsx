import {DefaultTheme, NavigationContainer} from '@react-navigation/native';
import React, {useCallback, useEffect, useState} from 'react';
import * as SplashScreen from "expo-splash-screen";
import {THEME} from "@theme/theme";
import {View} from "react-native";
import {ToastProvider} from "@context/ToastContext";
import {LoadingProvider} from "@context/LoadingContext";
import {AuthProvider} from "@context/AuthContext";
import StackNavigator from "@navigation/StackNavigator";
import {StatusBar} from "expo-status-bar";
import LoadingScreen from "@screens/LoadingScreen";

SplashScreen.preventAutoHideAsync().catch((e) => console.error(e));

const navTheme = DefaultTheme;
navTheme.colors.background = THEME.COLORS.white;


export default function App() {
    const [isAppReady, setIsAppReady] = useState(false);

    const onLayoutRootView = useCallback(async () => {
        if (isAppReady) {
            await SplashScreen.hideAsync();
        }
    }, [isAppReady]);

    useEffect(() => {
        async function prepare() {
            try {
                await new Promise(resolve => setTimeout(resolve, 1000));
            } catch (e) {
                console.warn(e);
            } finally {
                setIsAppReady(true);
            }
        }

        prepare().catch((e) => console.error(e));
    }, []);

    if (!isAppReady) {
        return null;
    }

  return (
      <View onLayout={onLayoutRootView} style={{flex: 1}}>
          <ToastProvider>
              <LoadingProvider>
                  <NavigationContainer theme={navTheme}>
                      <AuthProvider>
                          <StackNavigator/>
                          <LoadingScreen/>
                      </AuthProvider>
                  </NavigationContainer>
              </LoadingProvider>
          </ToastProvider>
          <StatusBar style="light"/>
      </View>
  );
}