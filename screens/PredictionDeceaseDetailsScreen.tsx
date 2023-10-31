import {Image, ImageBackground, Text, View} from "react-native";
import {useNavigation, useRoute} from "@react-navigation/native";
import {THEME} from "@theme/theme";
import {StatusBar} from "expo-status-bar";
import {PATHS} from "@constants/PATHS";
import React from "react";

export default function PredictionDeceaseDetailsScreen() {
    const route = useRoute();
    useNavigation();
    // @ts-ignore
    const {image, decease} = route.params;
    return (
        <View style={{flex: 1}}>
            <ImageBackground source={PATHS.IMAGES.BG1}
                             style={{flex: 3, justifyContent: "center", alignItems: "center"}}>
                <Text style={{
                    marginTop: 40,
                    textAlign: "center",
                    marginVertical: 20,
                    fontSize: 20,
                    fontWeight: "bold",
                    color: THEME.COLORS.white
                }}>Plant
                    Details</Text>
                <Image source={{uri: image}} style={{width: "80%", height: "60%", borderRadius: 10}}/>

            </ImageBackground>
            <Text style={{textAlign: "center", marginVertical: 20, fontSize: 20, fontWeight: "bold"}}>Plant
                Details</Text>
            <View style={{
                flex: 1,
                paddingHorizontal: 40,
                backgroundColor: THEME.COLORS.primary,
                justifyContent: "center",
                borderTopLeftRadius: 30,
                borderTopRightRadius: 30
            }}>
                <Text
                    style={{color: THEME.COLORS.white, fontSize: 18, fontWeight: "bold"}}>Decease
                    : {decease}</Text>
            </View>
            <StatusBar style="light"/>
        </View>
    );
}