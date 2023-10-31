import {ImageBackground, ScrollView, Text, TouchableOpacity, View} from "react-native";
import {useNavigation, useRoute} from "@react-navigation/native";
import {THEME} from "@theme/theme";
import {ResizeMode, Video} from "expo-av";
import {StatusBar} from "expo-status-bar";
import {PATHS} from "@constants/PATHS";
import React from "react";

export default function PredictionDetailsScreen() {
    const route = useRoute();
    const navigation = useNavigation();
    // @ts-ignore
    const {image, confidence, prediction, week, videos, images} = route.params;

    const handleCompare = () => {
        // @ts-ignore
        navigation.navigate("Compare", {image, images});
    }

    return (
        <View style={{flex: 1}}>
            <ImageBackground source={PATHS.IMAGES.BACKGROUND}
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
                <ScrollView
                    style={{marginBottom: 20}}
                    showsVerticalScrollIndicator={false}
                >
                    {
                        videos && videos.length > 0 && videos.map((video: any, index: number) => (
                            (
                                <View key={index}
                                      style={{marginVertical: 10, justifyContent: "center", alignItems: "center"}}>
                                    <Text style={{
                                        marginVertical: 10,
                                        fontWeight: "bold",
                                        color: THEME.COLORS.white,
                                        fontSize: 20
                                    }}>Week {video.week}</Text>
                                    <Video
                                        key={index}
                                        style={{
                                            width: 350,
                                            height: 200,
                                            borderRadius: 10,
                                            backgroundColor: THEME.COLORS.black,
                                        }}
                                        source={{
                                            uri: video.url,
                                        }}
                                        useNativeControls
                                        resizeMode={ResizeMode.COVER}
                                        isLooping
                                    />
                                </View>
                            )
                        ))
                    }
                </ScrollView>
            </ImageBackground>
            <Text style={{textAlign: "center", marginVertical: 20, fontSize: 20, fontWeight: "bold"}}>Plant
                Details</Text>
            <View style={{
                flex: 1,
                paddingHorizontal: 40,
                backgroundColor: THEME.COLORS.primary,
                justifyContent: "center",
                borderTopLeftRadius: 30,
                borderTopRightRadius: 30,
                paddingTop: 20
            }}>
                <Text style={{color: THEME.COLORS.white, paddingVertical: 5, marginTop: 20, fontSize: 18}}>Predicted
                    Type
                    : {prediction}</Text>
                <Text style={{color: THEME.COLORS.white, paddingVertical: 5, fontSize: 18}}>Confidence
                    : {confidence}</Text>
                <Text style={{color: THEME.COLORS.white, paddingVertical: 5, fontSize: 18}}>Week : {week}</Text>
                <TouchableOpacity
                    onPress={handleCompare}
                >
                    <Text style={{
                        textAlign: "center",
                        color: THEME.COLORS.black,
                        backgroundColor: THEME.COLORS.white,
                        marginHorizontal: 40,
                        paddingVertical: 10,
                        borderRadius: 20,
                        fontSize: 20,
                        fontWeight: "bold",
                        marginVertical: 30
                    }}>Compare</Text>
                </TouchableOpacity>
            </View>
            <StatusBar style="light"/>
        </View>
    );
}