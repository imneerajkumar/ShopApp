import React, { useCallback, useEffect, useState } from 'react';
import { FlatList, Button, View, ActivityIndicator, StyleSheet, Text } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { HeaderButtons, Item } from 'react-navigation-header-buttons'

import colors from '../../constants/colors';
import HeaderButton from '../../components/UI/HeaderButton';
import ProductItem from '../../components/shop/ProductItem';
import * as cartActions from '../../store/actions/cart';
import * as productsActions from '../../store/actions/products';

function ProductsOverviewScreen({ navigation }) {
  const [isLoading, setIsLoading] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState("");
  const products = useSelector(state => state.products.availableProducts);
  const dispatch = useDispatch();

  const loadProducts = useCallback(async () => {
    setError(null);
    setIsRefreshing(true);
    try {
      await dispatch(productsActions.fetchProducts());
    } catch (err){
      setError(err.message);
    }
    setIsRefreshing(false);
  }, [dispatch]);

  useEffect(() => {
    const willFocusSub = navigation.addListener('willFocus', loadProducts);
    return () => {
      willFocusSub.remove();
    };
  }, [loadProducts]);

  useEffect(() => {
    setIsLoading(true);
    loadProducts().then(() => {
      setIsLoading(false);
    });
  }, [dispatch, loadProducts]);

  const selectItemHandler = (id, title) => {
    navigation.navigate("ProductDetail", {
      productId: id,
      productTitle: title
    });
  }

  if (error) {
    return (
      <View style={styles.centered}>
        <Text>An error occured!</Text>
        <Button title="Try Again" onPress={loadProducts} color={colors.primary} />
      </View>
    );
  }

  if (isLoading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color={colors.accent} />
      </View>
    );
  }

  if (!isLoading && products.length === 0) {
    return (
      <View style={styles.centered}>
        <Text>No Products available!!!</Text>
      </View>
    );
  }

  return (
    <FlatList 
      onRefresh={loadProducts}
      refreshing={isRefreshing}
      data={products}
      renderItem={({ item }) => 
        <ProductItem item={item} onSelect={() => selectItemHandler(item.id, item.title)}>
          <Button 
            title="View Details" 
            onPress={() => selectItemHandler(item.id, item.title)} 
            color={colors.primary}
          />
          <Button 
            title="Add to Cart" 
            onPress={() => dispatch(cartActions.addToCart(item))}
            color={colors.primary}
          />
        </ProductItem>
      }
    />
  );
}

ProductsOverviewScreen.navigationOptions = (navData) => {
  return {
    headerTitle: "All Products",
    headerLeft: () => (
      <HeaderButtons HeaderButtonComponent={HeaderButton}>
        <Item 
          title="Menu" 
          iconName="ios-menu" 
          onPress={() => {navData.navigation.toggleDrawer()}} 
        />
      </HeaderButtons>
    ),
    headerRight: () => (
      <HeaderButtons HeaderButtonComponent={HeaderButton}>
        <Item 
          title="Cart" 
          iconName="ios-cart" 
          onPress={() => {navData.navigation.navigate("Cart")}} 
        />
      </HeaderButtons>
    )  
  };
}

const styles = StyleSheet.create({
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center"
  }
})

export default ProductsOverviewScreen;