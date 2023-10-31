import {Image, ImageBackground, ScrollView, Text} from "react-native";
import {PATHS} from "@constants/PATHS";
import {THEME} from "@theme/theme";
import {useRoute} from "@react-navigation/native";

export default function PlantComparisonScreen() {
    const route = useRoute();
    // @ts-ignore
    const {image, images} = route.params;

    return (
        <ImageBackground source={PATHS.IMAGES.SEARCH} style={{flex: 1}}>
            <ScrollView style={{marginTop: "20%", marginHorizontal: 30}} showsVerticalScrollIndicator={false}>
                <Text style={{color: THEME.COLORS.white, fontSize: 28, fontWeight: "bold"}}>Plant Comparison</Text>
                <Text style={{color: THEME.COLORS.white, fontSize: 20, marginTop: 20, textAlign: "center"}}>Captured
                    Image</Text>
                <Image
                    source={{uri: image}}
                    style={{width: "100%", height: 300, marginVertical: 10, borderRadius: 10}}
                />
                <Text style={{color: THEME.COLORS.white, fontSize: 20, marginTop: 20, textAlign: "center"}}>Identical
                    aged Plants</Text>
                <Image
                    source={{uri: images && images.image1}}
                    style={{width: "100%", height: 300, marginVertical: 10, borderRadius: 10}}
                />
                <Image
                    source={{uri: images && images.image2}}
                    style={{width: "100%", height: 300, marginVertical: 10, borderRadius: 10, marginBottom: 30}}
                />
            </ScrollView>
        </ImageBackground>
    )
}