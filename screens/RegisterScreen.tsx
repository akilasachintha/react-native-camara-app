import React from "react";
import {
    ImageBackground,
    KeyboardAvoidingView,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View
} from "react-native";
import {PATHS} from "@constants/PATHS";
import {StatusBar} from "expo-status-bar";
import * as yup from 'yup';
import {Formik} from "formik";
import {useNavigation} from '@react-navigation/native';
import {BASE_URL, createAxiosInstance} from "@config/axiosConfig";
import {useAuthContext} from "@context/AuthContext";
import {useToast} from "@context/ToastContext";
import {useLoadingContext} from "@context/LoadingContext";

const initialValues = {
    firstName: '',
    lastName: '',
    email: '',
    city: '',
    occupation: '',
    password: '',
    confirmPassword: '',
};

export interface FormField {
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
    const authContext = useAuthContext();
    const axiosInstance = createAxiosInstance(authContext, BASE_URL.ECO_PAINT);
    const {showToast} = useToast();
    const {hideLoading} = useLoadingContext();

    const handleSubmit = async (values: any) => {
        const data = {
            first_name: values.firstName,
            last_name: values.lastName,
            email: values.email,
            city: values.city,
            occupation: values.occupation,
            password: values.password,
        }

        const response = await axiosInstance.post('/register', data);
        if (response.status === 200) {
            // @ts-ignore
            navigation.navigate('Login');
            showToast("Successfully registered");
            hideLoading();
        } else {
            showToast("Something went wrong");
            hideLoading();
        }
    }

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
                                <Text>Register</Text>
                            </TouchableOpacity>

                            <TouchableOpacity
                                // @ts-ignore
                                onPress={() => navigation.navigate('Login')}
                                style={styles.loginButton}
                            >
                                <Text style={styles.loginText}>Already a Member? Login</Text>
                            </TouchableOpacity>
                        </View>
                    )}
                </Formik>
            </ScrollView>
            <StatusBar style="light"/>
        </ImageBackground>
    );
};

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

export default RegisterScreen;
