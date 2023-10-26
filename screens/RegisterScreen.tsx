import React from "react";
import {ImageBackground, KeyboardAvoidingView, StyleSheet, Text, TextInput, TouchableOpacity, View} from "react-native";
import {PATHS} from "@constants/PATHS";
import {StatusBar} from "expo-status-bar";
import * as yup from 'yup';
import {Formik} from "formik";
import {useNavigation} from '@react-navigation/native';

const initialValues = {
    firstName: '',
    lastName: '',
    email: '',
    city: '',
    occupation: '',
    password: '',
    confirmPassword: '',
};

interface FormField {
    name: string;
    label: string;
    secureTextEntry?: boolean;
}

const validationSchema = yup.object().shape({
    firstName: yup.string().required('First Name is required'),
    lastName: yup.string().required('Last Name is required'),
    email: yup.string().email('Please enter a valid email').required('Email is required'),
    city: yup.string().required('City is required'),
    occupation: yup.string().required('Occupation is required'),
    password: yup.string().min(6, 'Password must be at least 6 characters').required('Password is required'),
    // @ts-ignore
    confirmPassword: yup.string().oneOf([yup.ref('password'), null], 'Passwords must match'),
});

const formFields: FormField[] = [
    {name: 'firstName', label: 'First Name'},
    {name: 'lastName', label: 'Last Name'},
    {name: 'email', label: 'Email'},
    {name: 'city', label: 'City'},
    {name: 'occupation', label: 'Occupation'},
    {name: 'password', label: 'Password', secureTextEntry: true},
    {name: 'confirmPassword', label: 'Confirm Password', secureTextEntry: true},
];

const RegisterScreen: React.FC = () => {
    const navigation = useNavigation();

    const handleSubmit = (values: any) => {
        console.log(values);
        // Handle form submission here, e.g., authenticate the user
    }

    // @ts-ignore
    return (
        <ImageBackground source={PATHS.IMAGES.BACKGROUND} style={styles.container}>
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
                                        style={styles.input}
                                        placeholder={field.label}
                                        onChangeText={handleChange(field.name)}
                                        // @ts-ignore
                                        value={values[field.name]}
                                        placeholderTextColor="white"
                                        secureTextEntry={field.secureTextEntry}
                                    />
                                    {touched[field.name] && errors[field.name] &&
                                        <Text style={styles.errorText}>{errors[field.name]}</Text>}
                                </View>
                            ))}

                            <TouchableOpacity onPress={() => handleSubmit()} style={styles.button}>
                                <Text>Register</Text>
                            </TouchableOpacity>

                            <TouchableOpacity
                                onPress={
                                    // @ts-ignore
                                    () => navigation.navigate('Login')
                                }
                                style={styles.loginButton}
                            >
                                <Text style={styles.loginText}>Already a Member? Login</Text>
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

export default RegisterScreen;
