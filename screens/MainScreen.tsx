import {ImageBackground, Text, TouchableOpacity, View} from "react-native";
import {THEME} from "@theme/theme";
import {PATHS} from "@constants/PATHS";
import {useNavigation} from "@react-navigation/native";

export default function MainScreen() {
    const navigation = useNavigation();
    return (
        <ImageBackground source={PATHS.IMAGES.BG1} style={{flex: 1, justifyContent: "space-evenly"}}>
            <View>

                <View
                    style={{
                        justifyContent: "center",
                        alignItems: "center",
                        flexDirection: "row",
                        marginHorizontal: 40,
                        marginVertical: 5,
                        height: "60%"
                    }}>
                    <TouchableOpacity activeOpacity={0.7}
                                      onPress={() => {
                                          // @ts-ignore
                                          navigation.navigate("Home");
                                      }}
                                      style={{
                                          backgroundColor: THEME.COLORS.primary,
                                          opacity: 0.8,
                                          width: "50%",
                                          height: "50%",
                                          marginVertical: 10,
                                          marginHorizontal: 20,
                                          padding: 30,
                                          borderRadius: 20,
                                          alignItems: "center",
                                          justifyContent: "center"
                                      }}>
                        <Text
                            style={{textAlign: "center", color: THEME.COLORS.white, fontSize: 20, fontWeight: "bold"}}>Scan
                            and Predict</Text>
                    </TouchableOpacity>
                    <TouchableOpacity activeOpacity={0.7}
                                      onPress={() => {
                                          // @ts-ignore
                                          navigation.navigate("PlantList");
                                      }}
                                      style={{
                                          backgroundColor: THEME.COLORS.primary,
                                          opacity: 0.8,
                                          width: "50%",
                                          height: "50%",
                                          marginVertical: 10,
                                          marginHorizontal: 20,
                                          padding: 30,
                                          borderRadius: 20,
                                          alignItems: "center",
                                          justifyContent: "center"
                                      }}>
                        <Text
                            style={{textAlign: "center", color: THEME.COLORS.white, fontSize: 20, fontWeight: "bold"}}>Search
                            Plants</Text>
                    </TouchableOpacity>
                </View>
                <TouchableOpacity activeOpacity={0.7}
                                  onPress={() => {
                                      // @ts-ignore
                                      navigation.navigate("HomeDecease");
                                  }}
                                  style={{
                                      backgroundColor: THEME.COLORS.primary,
                                      opacity: 0.8,
                                      width: "90%",
                                      height: "20%",
                                      marginVertical: 10,
                                      marginHorizontal: 20,
                                      padding: 30,
                                      borderRadius: 20,
                                      alignItems: "center",
                                      justifyContent: "center"
                                  }}>
                    <Text style={{textAlign: "center", color: THEME.COLORS.white, fontSize: 20, fontWeight: "bold"}}>Detect
                        Decease</Text>
                </TouchableOpacity>
            </View>
            <TouchableOpacity
                onPress={() => {
                    navigation.reset(
                        {
                            index: 0,
                            // @ts-ignore
                            routes: [{name: 'Login'}],
                        }
                    );
                }}
            >
                <Text style={{
                    textAlign: "center",
                    color: THEME.COLORS.black,
                    backgroundColor: THEME.COLORS.white,
                    marginHorizontal: 40,
                    paddingVertical: 10,
                    borderRadius: 20,
                    fontSize: 20,
                    fontWeight: "bold"
                }}>Logout</Text>
            </TouchableOpacity>
        </ImageBackground>
    )
}