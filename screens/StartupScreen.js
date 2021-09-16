import React, { useEffect } from 'react';
import { StyleSheet, View, ActivityIndicator } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useDispatch } from 'react-redux';

import * as authActions from '../store/actions/auth';
import colors from '../constants/colors';

function StartupScreen({ navigation }) {
  const dispatch = useDispatch();

  useEffect(() => {
    const tryLogin = async () => {
      const userData = await AsyncStorage.getItem('userData');
      if (!userData) {
        navigation.navigate('Auth');
        return;
      }
      const transformedData = JSON.parse(userData);
      const { token, userId, expiryDate } = transformedData;
      const expirationDate = new Date(expiryDate);

      if (expirationDate <= new Date() || !token || !userId) {
        navigation.navigate('Auth');
        return;
      }

      const expirationTime = expirationDate.getTime() - new Date().getTime();

      navigation.navigate('Shop');
      dispatch(authActions.authenticate(token, userId, expirationTime));
    };

    tryLogin();
  }, []);

  return (
    <View style={styles.centered}>
      <ActivityIndicator size="large" color={colors.accent} />
    </View>
  );
}

const styles = StyleSheet.create({
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center"
  }
})

export default StartupScreen;