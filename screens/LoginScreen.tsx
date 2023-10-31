import React, { useState } from "react";
import {
    ImageBackground,
    KeyboardAvoidingView,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";
import { PATHS } from "@constants/PATHS";
import { StatusBar } from "expo-status-bar";
import * as yup from "yup";
import { Formik } from "formik";
import { useNavigation } from "@react-navigation/native";
import { useAuthContext } from "@context/AuthContext";
import { BASE_URL, createAxiosInstance } from "@config/axiosConfig";
import { useToast } from "@context/ToastContext";
import { useLoadingContext } from "@context/LoadingContext";
import {FormField} from "@screens/RegisterScreen";

const initialValues = { email: "", password: "" };

const validationSchema = yup.object().shape({
    email: yup.string().email("Please enter a valid email").required("Email is required"),
    password: yup.string().min(6, "Password must be at least 6 characters").required("Password is required"),
});

const formFields: FormField[] = [
    {name: 'email', label: 'Email'},
    {name: 'password', label: 'Password', secureTextEntry: true},
];

export default function LoginScreen() {
    const navigation = useNavigation();
    const authContext = useAuthContext();
    const axiosInstance = createAxiosInstance(authContext, BASE_URL.ECO_PAINT);
    const { showToast } = useToast();
    const { hideLoading } = useLoadingContext();
    const [isRegisterTextUnderlined, setIsRegisterTextUnderlined] = useState(false);

    const handleRegistration = () => {
        // @ts-ignore
        navigation.navigate("Register");
    };

    const handleSubmit = async (values: any) => {
        try {
            const response = await axiosInstance.post("/login", {
                email: values.email,
                password: values.password,
            });

            if (response.status === 200) {
                const { token } = response.data && response.data.body && response.data.body.data;
                authContext.login(token);
                hideLoading();
                console.log("Login successful");
            } else {
                showToast("Invalid email or password");
                hideLoading();
            }
        } catch (e) {
            console.error(e);
            showToast("Invalid email or password");
        }
    };

    const toggleUnderline = () => {
        setIsRegisterTextUnderlined(!isRegisterTextUnderlined);
    };

    return (
        <ImageBackground source={PATHS.IMAGES.BACKGROUND} style={styles.container}>
            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.container}>
                <Formik
                    initialValues={initialValues}
                    validationSchema={validationSchema}
                    onSubmit={handleSubmit}
                >
                    {({values, handleChange, handleSubmit, errors, touched}: any) => (
                        <View style={styles.formContainer}>
                            {formFields.map((field: FormField) => (
                                <View style={styles.inputView} key={field.name}>
                                    <TextInput
                                        style={styles.input}
                                        placeholder={field.label}
                                        onChangeText={handleChange(field.name)}
                                        value={values[field.name]}
                                        placeholderTextColor="white"
                                        secureTextEntry={field.secureTextEntry}
                                    />
                                    {touched[field.name] && errors[field.name] &&
                                        <Text style={styles.errorText}>{errors[field.name]}</Text>}
                                </View>
                            ))}

                            <TouchableOpacity onPress={handleSubmit} style={styles.button}>
                                <Text>Login</Text>
                            </TouchableOpacity>

                            <TouchableOpacity
                                // @ts-ignore
                                onPress={() => navigation.navigate('Register')}
                                style={styles.loginButton}
                            >
                                <Text style={styles.loginText}>Not a Member? Register</Text>
                            </TouchableOpacity>
                        </View>
                    )}
                </Formik>
            </ScrollView>
            <StatusBar style="light"/>
        </ImageBackground>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
    },
    formContainer: {
        justifyContent: "center",
        marginHorizontal: "7%",
    },
    inputView: {
        marginBottom: 16,
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
        marginVertical: 8,
    },
    button: {
        alignItems: "center",
        backgroundColor: "#DDDDDD",
        padding: 12,
        borderRadius: 10,
        marginTop: 20,
    },
    loginButton: {
        alignItems: "center",
        padding: 12,
        borderRadius: 10,
        marginTop: 12,
    },
    loginText: {
        color: 'white',
    },
});
