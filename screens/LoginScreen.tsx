import React, {useState} from "react";
import {ImageBackground, KeyboardAvoidingView, StyleSheet, Text, TextInput, TouchableOpacity, View} from "react-native";
import {PATHS} from "@constants/PATHS";
import {StatusBar} from "expo-status-bar";
import * as yup from 'yup';
import {Formik} from "formik";
import {useNavigation} from '@react-navigation/native';
import {useAuthContext} from "@context/AuthContext";
import {BASE_URL, createAxiosInstance} from "@config/axiosConfig";
import {useToast} from "@context/ToastContext";
import {useLoadingContext} from "@context/LoadingContext";

const initialValues = {email: '', password: ''};

const validationSchema = yup.object().shape({
    email: yup
        .string()
        .email('Please enter a valid email')
        .required('Email is required'),
    password: yup
        .string()
        .min(6, 'Password must be at least 6 characters')
        .required('Password is required'),
});

export default function LoginScreen() {
    const navigation = useNavigation();
    const authContext = useAuthContext();
    const axiosInstance = createAxiosInstance(authContext, BASE_URL.ECO_PAINT);
    const {showToast} = useToast();
    const {hideLoading} = useLoadingContext();
    const [isRegisterTextUnderlined, setIsRegisterTextUnderlined] = useState(false);

    const handleRegistration = () => {
        // @ts-ignore
        navigation.navigate('Register');
    };

    const handleSubmit = async (values: any) => {
        try {
            const response = await axiosInstance.post('/login', {
                email: values.email,
                password: values.password,
            });

            if (response.status === 200) {
                const {token} = response.data && response.data.body && response.data.body.data;
                authContext.login(token);
                hideLoading();
                console.log('Login successful');
            } else {
                showToast('Invalid email or password');
                hideLoading();
            }
        } catch (e) {
            console.error(e);
            showToast('Invalid email or password');
        }
    }

    const toggleUnderline = () => {
        setIsRegisterTextUnderlined(!isRegisterTextUnderlined);
    };

    return (
        <ImageBackground source={PATHS.IMAGES.BACKGROUND} style={styles.container}>
                <Formik
                    initialValues={initialValues}
                    style={styles.form}
                    validationSchema={validationSchema}
                    onSubmit={handleSubmit}
                >
                    {({values, handleChange, handleSubmit, errors, touched}) => (
                        <>
                            <KeyboardAvoidingView behavior="padding">
                                <View style={styles.inputView}>
                                    <TextInput
                                        style={styles.input}
                                        placeholder="Email"
                                        onChangeText={handleChange('email')}
                                        value={values.email}
                                        placeholderTextColor="white"
                                    />
                                    {touched.email && errors.email &&
                                        <Text style={styles.errorText}>{errors.email.toString()}</Text>}
                                </View>
                                <View style={styles.inputView}>
                                    <TextInput
                                        style={styles.input}
                                        placeholder="Password"
                                        onChangeText={handleChange('password')}
                                        value={values.password}
                                        secureTextEntry
                                        placeholderTextColor="white"
                                    />
                                    {touched.password && errors.password &&
                                        <Text style={styles.errorText}>{errors.password.toString()}</Text>}
                                </View>
                                <TouchableOpacity onPress={() => handleSubmit()} style={styles.button}>
                                    <Text>Login</Text>
                                </TouchableOpacity>

                                <TouchableOpacity
                                    onPress={handleRegistration}
                                    style={styles.registerButton}
                                    onPressIn={toggleUnderline}
                                    onPressOut={toggleUnderline}
                                >
                                    <Text
                                        style={[styles.registerText, isRegisterTextUnderlined && styles.underlinedText]}>Not
                                        a Member? Register Now</Text>
                                </TouchableOpacity>
                            </KeyboardAvoidingView>
                        </>
                    )}
                </Formik>
            <StatusBar style="light"/>
        </ImageBackground>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        paddingHorizontal: "6%",
    },
    form: {
        flex: 1,
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
    registerButton: {
        alignItems: "center",
        padding: 10,
        borderRadius: 10,
        marginTop: "2%",
    },
    registerText: {
        color: 'white',
    },
    underlinedText: {
        textDecorationLine: 'underline',
    },
});

