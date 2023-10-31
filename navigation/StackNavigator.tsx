import {createNativeStackNavigator} from "@react-navigation/native-stack";
import LoginScreen from "@screens/LoginScreen";
import RegisterScreen from "@screens/RegisterScreen";
import HomeScreen from "@screens/HomeScreen";
import React from "react";
import PredictionDetailsScreen from "@screens/PredictionDetailsScreen";
import MainScreen from "@screens/MainScreen";
import PlantListScreen from "@screens/PlantListScreen";
import {useAuthContext} from "@context/AuthContext";
import SubmitDetailsScreen from "@screens/SubmitDetailsScreen";
import PlantComparisonScreen from "@screens/PlantComparisonScreen";
import HomeDeceaseScreen from "@screens/HomeDeceaseScreen";
import PredictionDeceaseDetailsScreen from "@screens/PredictionDeceaseDetailsScreen";

const Stack = createNativeStackNavigator();
export default function StackNavigator() {
    const {isLoggedIn} = useAuthContext();

    return (
        <Stack.Navigator screenOptions={{
            headerShown: false,
            animation: "slide_from_right",
        }}>
            <Stack.Screen name="Login" component={LoginScreen}/>
            <Stack.Screen name="Register" component={RegisterScreen}/>
            <Stack.Screen name="Main" component={MainScreen}/>
            <Stack.Screen name="Home" component={HomeScreen}/>
            <Stack.Screen name="HomeDecease" component={HomeDeceaseScreen}/>
            <Stack.Screen name="Prediction" component={PredictionDetailsScreen}/>
            <Stack.Screen name="PredictionDecease" component={PredictionDeceaseDetailsScreen}/>
            <Stack.Screen name="PlantList" component={PlantListScreen}/>
            <Stack.Screen name="SubmitPlant" component={SubmitDetailsScreen}/>
            <Stack.Screen name="Compare" component={PlantComparisonScreen}/>
        </Stack.Navigator>
    );
}