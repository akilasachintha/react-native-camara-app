import React, {useEffect, useState} from "react";
import {
    Image,
    ImageBackground,
    RefreshControl,
    ScrollView,
    Text,
    TextInput,
    TouchableOpacity,
    View
} from "react-native";
import {useAuthContext} from "@context/AuthContext";
import {BASE_URL, createAxiosInstance} from "@config/axiosConfig";
import {useToast} from "@context/ToastContext";
import {useLoadingContext} from "@context/LoadingContext";
import {PATHS} from "@constants/PATHS";
import {THEME} from "@theme/theme";

export default function PlantListScreen() {
    const authContext = useAuthContext();
    const axiosInstance = createAxiosInstance(authContext, BASE_URL.ECO_PAINT);
    const {showToast} = useToast();
    const {showLoading, hideLoading} = useLoadingContext();
    const [searchQuery, setSearchQuery] = useState("");
    const [plants, setPlants] = useState([]);
    const [filteredPlants, setFilteredPlants] = useState([]);
    const [refreshing, setRefreshing] = useState(false);

    const getPlants = async () => {
        try {
            const response = await axiosInstance.get('/user/unhidden_images');
            console.log(response.data);
            if (response.status === 200) {
                const result = response.data && response.data.body && response.data.body.data && response.data.body.data.images;
                setPlants(result);
                setFilteredPlants(result);
                hideLoading();
            } else {
                showToast('Error getting plants');
                hideLoading();
            }
        } catch (e) {
            console.error(e);
            showToast('Error getting plants');
        } finally {
            setRefreshing(false);
        }
    }

    const hidePlant = async (id: string) => {
        try {
            const response = await axiosInstance.put(`hide/${id}`);
            console.log(response.data, id);
            getPlants().catch((e) => console.error(e));

            if (response.status === 200) {
                getPlants().catch((e) => console.error(e));
                hideLoading();
            } else {
                showToast('Error hiding plant');
                hideLoading();
            }
        } catch (e) {
            console.error(e);
            console.log(id);
            showToast('Error hiding plant');
        }
    }

    useEffect(() => {
        getPlants().catch((e) => console.error(e));
    }, []);

    useEffect(() => {
        const filtered = plants && plants.length > 0 && plants.filter((plant: any) => {
            return (
                plant &&
                plant.prediction &&
                plant.prediction.predicted_type &&
                plant.prediction.predicted_type.toLowerCase().includes(searchQuery.toLowerCase())
            );
        });
        if (filtered) {
            setFilteredPlants(filtered);
        }
    }, [searchQuery]);

    const onRefresh = () => {
        setRefreshing(true);
        getPlants().catch((e) => console.error(e));
    }

    return (
        <View style={{flex: 1}}>
            <ImageBackground source={PATHS.IMAGES.SEARCH} style={{flex: 1}}>
                <View style={{flex: 1}}>
                    <TextInput
                        style={{
                            borderWidth: 1,
                            padding: 10,
                            marginBottom: 10,
                            marginHorizontal: 30,
                            marginVertical: 50,
                            borderRadius: 10,
                            borderColor: THEME.COLORS.white,
                            backgroundColor: THEME.COLORS.white
                        }}
                        placeholder="Search for plants..."
                        value={searchQuery}
                        onChangeText={setSearchQuery}
                    />
                    <ScrollView
                        style={{paddingHorizontal: 30, paddingVertical: 10}}
                        showsVerticalScrollIndicator={false}
                        refreshControl={
                            <RefreshControl
                                refreshing={refreshing}
                                onRefresh={onRefresh}
                            />
                        }
                    >
                        {filteredPlants && filteredPlants.length > 0 ? (
                            filteredPlants.map((plant: any, index) => (
                                <View key={index} style={{
                                    backgroundColor: 'rgba(255, 255, 255, 0.8)',
                                    marginBottom: 20,
                                    paddingVertical: 10,
                                    paddingHorizontal: 20,
                                    borderRadius: 10
                                }}>
                                    <TouchableOpacity key={index} activeOpacity={0.8} style={{
                                        paddingBottom: 20,
                                        flexDirection: "row",
                                        justifyContent: "space-between",
                                        alignItems: "center"
                                    }}>
                                        <Image source={{uri: plant.image_url}}
                                               style={{width: "20%", height: "100%", borderRadius: 10}}/>
                                        <View style={{paddingHorizontal: 10}}>
                                            <Text style={{fontSize: 20, fontWeight: "bold", marginLeft: 10}}>
                                                {plant.prediction.predicted_type}
                                            </Text>
                                            <Text style={{fontSize: 16, marginLeft: 10}}>
                                                Week: {plant.prediction.Week}
                                            </Text>
                                            <Text style={{fontSize: 16, marginLeft: 10}}>
                                                Confidence: {plant.prediction.Confidence}
                                            </Text>
                                        </View>
                                    </TouchableOpacity>
                                    <TouchableOpacity
                                        onPress={() => {
                                            hidePlant(plant && plant.id).catch((e) => console.error(e));
                                        }}
                                        style={{
                                            flex: 1,
                                            alignItems: "center",
                                            justifyContent: "flex-end",
                                            backgroundColor: "rgba(75,168,66,0.52)",
                                            paddingVertical: 10,
                                            borderRadius: 30,
                                            marginRight: 2,
                                            paddingHorizontal: 10
                                        }}>
                                        <Text>Hide</Text>
                                    </TouchableOpacity>
                                </View>
                            ))
                        ) : (
                            <Text style={{color: THEME.COLORS.white}}>No matching plants found.</Text>
                        )}
                    </ScrollView>
                </View>
            </ImageBackground>
        </View>
    );
}
