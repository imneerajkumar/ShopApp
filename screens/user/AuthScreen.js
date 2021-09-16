import React, { useCallback, useEffect, useReducer, useState } from 'react';
import { ScrollView, View, KeyboardAvoidingView, StyleSheet, Button, ActivityIndicator, Alert } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useDispatch } from 'react-redux';

import * as authActions from '../../store/actions/auth';
import Card from '../../components/UI/Card';
import Input from '../../components/UI/Input';
import colors from '../../constants/colors';

const formReducer = (state, action) => {
  if (action.type === 'UPDATE') {
    const updatedValues = {
      ...state.inputValues,
      [action.input]: action.value
    };
    const updatedValidities = {
      ...state.inputValidities,
      [action.input]: action.isValid
    };
    let updatedFormIsValid = true;
    for (const key in updatedValidities) {
      updatedFormIsValid = updatedFormIsValid && updatedValidities[key];
    }
    return {
      inputValues: updatedValues,
      inputValidities: updatedValidities,
      formIsValid: updatedFormIsValid
    };
  }
  return state;
};

function AuthScreen({ navigation }) {
  const [isSignup, setIsSignUp] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const dispatch = useDispatch();

  const [formState, dispatchForm] =  useReducer(formReducer, {
    inputValues: {
      email: "",
      password: ""
    }, 
    inputValidities: {
      email: false,
      password: false
    }, 
    formIsValid: false
  });

  useEffect(() => {
    if (error) {
      Alert.alert('An error occured!', error, [{text: "Okay"}])
    }
  }, [error]);

  const authHandler = async () => {
    let action;
    if (isSignup) {
      action = authActions.signup(
        formState.inputValues.email, 
        formState.inputValues.password
      );
    } else {
      action = authActions.login(
        formState.inputValues.email, 
        formState.inputValues.password
      );
    }

    setError(null);
    setIsLoading(true);
    try {
      await dispatch(action);
      navigation.navigate('Shop');
    } catch (err) {
      setError(err.message);
      setIsLoading(false);
    }  
  };

  const inputChangeHandler = useCallback((inputIdentifier, inputValue, inputValidity) => {
    dispatchForm({ 
      type: 'UPDATE', 
      value: inputValue,
      isValid: inputValidity,
      input: inputIdentifier
    });
  }, [dispatchForm]);

  return (
    <KeyboardAvoidingView style={styles.screen} behavior="height">
      <LinearGradient colors={[colors.accent, colors.primary]} style={styles.gradient}>
        <Card style={styles.authContainer}>
          <ScrollView>
            <Input 
              id="email" 
              label="E-mail"
              keyboardType="email-address"
              required
              email
              autoCapitalize="none"
              errorText="Please enter a valid email."
              initialValue=""
              onInputChange={inputChangeHandler}
            />
            <Input 
              id="password" 
              label="Password"
              keyboardType="default"
              secureTextEntry
              required
              minLength={5}
              autoCapitalize="none"
              errorText="Please enter a valid password."
              initialValue=""
              onInputChange={inputChangeHandler}
            />
            {isLoading ? (
              <ActivityIndicator size="small" color={colors.accent} />
            ) : (
              <View style={styles.button}>
                <Button 
                  title={isSignup ? "Signup" : "Login" } 
                  color={colors.accent} 
                  onPress={authHandler} 
                />
              </View>
            )}  
            <View style={styles.button}>
              <Button 
                title={`Switch to ${isSignup ? "Login" : "Signup"}`} 
                color={colors.primary} 
                onPress={() => setIsSignUp(prevState => !prevState)} 
              />
            </View>
          </ScrollView>
        </Card>
      </LinearGradient>
    </KeyboardAvoidingView>
  );
}

AuthScreen.navigationOptions = {
  headerTitle: "Authenticate"
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
  gradient: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center"
  },
  authContainer: {
    width: "80%",
    maxWidth: 400,
    maxHeight: 400,
    padding: 20
  },
  button: {
    marginTop: 10
  }
})

export default AuthScreen;