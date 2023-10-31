import React from "react";
import {ImageBackground, KeyboardAvoidingView, StyleSheet, Text, TextInput, TouchableOpacity, View} from "react-native";
import {PATHS} from "@constants/PATHS";
import {StatusBar} from "expo-status-bar";
import * as yup from 'yup';
import {Formik} from "formik";
import {useNavigation, useRoute} from '@react-navigation/native';
import {BASE_URL, createAxiosInstance} from "@config/axiosConfig";
import {useAuthContext} from "@context/AuthContext";
import {useToast} from "@context/ToastContext";
import {useLoadingContext} from "@context/LoadingContext";
import {THEME} from "@theme/theme";

const initialValues = {
    plantName: '',
    plantWeek: '',
    otherDetails: '',
};

interface FormField {
    name: string;
    label: string;
    secureTextEntry?: boolean;
    height?: number;
}

const validationSchema = yup.object().shape({
    plantName: yup
        .string()
        .required('Plant name is required'),
    plantWeek: yup
        .string()
        .required('Plant week is required'),
});

const formFields: FormField[] = [
    {name: 'plantName', label: 'Plant Species'},
    {name: 'plantWeek', label: 'Known Plant Age'},
    {name: 'otherDetails', label: 'Other Details', height: 4}
];

const SubmitDetailsScreen: React.FC = () => {
    const navigation = useNavigation();
    const authContext = useAuthContext();
    const axiosInstance = createAxiosInstance(authContext, BASE_URL.ECO_PAINT);
    const {showToast} = useToast();
    const {hideLoading} = useLoadingContext();
    const route = useRoute();
    // @ts-ignore
    const {image, latitude, longitude} = route.params;

    const handleSubmit = async (values: any) => {
        let formData = new FormData();
        let photo = {
            uri: image,
            type: 'image/jpeg',
            name: 'photo.jpg',
        };

        // @ts-ignore
        formData.append('image', photo);
        formData.append('longitude', longitude.toString());
        formData.append('latitude', latitude.toString());
        formData.append('plant_name', values.plantName);
        formData.append('plant_week', values.plantWeek);

        axiosInstance.post('undefinedimage', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        })
            .then(response => {
                console.log(response.data);
                showToast('Image uploaded successfully');

                if (response.data) {
                    // @ts-ignore
                    navigation.replace('Main');
                }

                hideLoading();
            })
            .catch(error => console.log(error));
    }

    // @ts-ignore
    return (
        <ImageBackground source={PATHS.IMAGES.SEARCH} style={styles.container}>
            <Text style={{color: THEME.COLORS.white, fontSize: 28, alignItems: "center", paddingVertical: 30}}>ENTER
                PLANT DETAILS</Text>
            <KeyboardAvoidingView behavior="padding">
                <Formik
                    initialValues={initialValues}
                    validationSchema={validationSchema}
                    onSubmit={handleSubmit}
                >
                    {({values, handleChange, handleSubmit, errors, touched}: any) => (
                        <>
                            {formFields.map((field: FormField) => (
                                <View style={styles.inputView} key={field.name}>
                                    <TextInput
                                        style={[styles.input, {height: field.height ? field.height * 40 : 40}]}
                                        placeholder={field.label}
                                        onChangeText={handleChange(field.name)}
                                        // @ts-ignore
                                        value={values[field.name]}
                                        placeholderTextColor="white"
                                        secureTextEntry={field.secureTextEntry}
                                        multiline={true}
                                        numberOfLines={field.height}
                                    />
                                    {touched[field.name] && errors[field.name] &&
                                        <Text style={styles.errorText}>{errors[field.name]}</Text>}
                                </View>
                            ))}

                            <TouchableOpacity onPress={() => handleSubmit()} style={styles.button}>
                                <Text>Submit</Text>
                            </TouchableOpacity>
                        </>
                    )}
                </Formik>
            </KeyboardAvoidingView>
            <StatusBar style="light"/>
        </ImageBackground>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        paddingHorizontal: "6%",
    },
    inputView: {
        marginBottom: "5%",
    },
    input: {
        height: 40,
        borderColor: 'white',
        borderWidth: 1,
        paddingHorizontal: 10,
        color: 'white',
        borderRadius: 10,
    },
    errorText: {
        color: 'red',
        marginVertical: "1%",
    },
    button: {
        alignItems: "center",
        backgroundColor: "#DDDDDD",
        padding: 10,
        borderRadius: 10,
        marginTop: "5%",
    },
    loginButton: {
        alignItems: "center",
        padding: 10,
        borderRadius: 10,
        marginTop: "2%",
    },
    loginText: {
        color: 'white',
    },
});

export default SubmitDetailsScreen;
