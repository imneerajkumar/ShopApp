import React from 'react';
import { StyleSheet, View, Text, Image, Button, ScrollView } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';

import colors from '../../constants/colors';
import * as cartActions from '../../store/actions/cart';

function ProductDetailScreen({ navigation }) {
  const productId = navigation.getParam("productId");
  const selectedProduct = useSelector(state => 
    state.products.availableProducts.find(prod => prod.id === productId)
  );
  const dispatch = useDispatch();

  return (
    <ScrollView>
      <Image style={styles.image} source={{uri: selectedProduct.imageUrl}} />
      <View style={styles.action}>
        <Button 
          color={colors.primary} 
          title="Add to Cart" 
          onPress={() => {
            dispatch(cartActions.addToCart(selectedProduct));
          }} 
        />
      </View>
      <Text style={styles.price}>${selectedProduct.price}</Text>
      <Text style={styles.description}>{selectedProduct.description}</Text>
    </ScrollView>
  );
}

ProductDetailScreen.navigationOptions = (navData) => {
  return {
    headerTitle: navData.navigation.getParam("productTitle")
  };
}

const styles = StyleSheet.create({
  image: {
    width: "100%",
    height: 300,
  },
  action: {
    marginVertical: 10,
    alignItems: "center"
  },
  price: {
    fontFamily: 'open-sans-bold',
    fontSize: 20,
    color: colors.grey,
    textAlign: "center",
    marginVertical: 20
  },
  description: {
    fontFamily: 'open-sans',
    fontSize: 14,
    textAlign: "center",
    marginHorizontal: 20
  }
})

export default ProductDetailScreen;