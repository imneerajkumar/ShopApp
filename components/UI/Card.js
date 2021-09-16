import React from 'react';
import { StyleSheet, View } from 'react-native';
import colors from '../../constants/colors';

function Card({ children, style }) {
  return (
    <View style={[styles.card, style]}>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    shadowColor: colors.black,
    shadowOpacity: 0.26,
    shadowOffset: {width: 0, height: 2},
    shadowRadius: 8,
    elevation: 7,
    borderRadius: 10,
    backgroundColor: colors.white,
  }
})

export default Card;