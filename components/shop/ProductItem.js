import React from 'react';
import { StyleSheet, View, Text, Image, TouchableOpacity, Platform, TouchableNativeFeedback } from 'react-native';

import Card from '../UI/Card';
import colors from '../../constants/colors';

function ProductItem({ item, onSelect, children }) {
  let Touchable = TouchableOpacity;
  if (Platform.OS === "android" && Platform.Version >= 21) {
    Touchable = TouchableNativeFeedback
  }

  return (  
    <Card style={styles.product}>
      <Touchable onPress={onSelect} useForeground>
        <View>
          <View style={styles.imageContainer}>
            <Image source={{uri: item.imageUrl}} style={styles.image} />
          </View>
          <View style={styles.detail}>
            <Text style={styles.title}>{item.title}</Text>
            <Text style={styles.price}>${item.price.toFixed(2)}</Text>
          </View>
          <View style={styles.actions}>
            {children}
          </View>
        </View>
      </Touchable> 
    </Card>
  );
}

const styles = StyleSheet.create({
  product: {
    height: 300,
    margin: 20,
  },
  imageContainer: {
    width: "100%",
    height: "60%",
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    overflow: "hidden"
  },
  image: {
    width: "100%",
    height: "100%"
  },
  detail: {
    alignItems: "center",
    height: "17%",
    padding: 10
  },
  title: {
    fontFamily: 'open-sans-bold',
    fontSize: 18,
    marginVertical: 2
  },
  price: {
    fontFamily: 'open-sans',
    fontSize: 14,
    color: colors.grey
  },
  actions: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    height: "23%",
    paddingHorizontal: 20
  }
})

export default ProductItem;