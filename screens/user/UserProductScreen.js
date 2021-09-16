import React, {useState, useCallback, useEffect} from 'react';
import { Button, FlatList, Alert, ActivityIndicator, StyleSheet, Text, View } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { HeaderButtons, Item } from 'react-navigation-header-buttons'

import HeaderButton from '../../components/UI/HeaderButton';
import ProductItem from '../../components/shop/ProductItem';
import colors from '../../constants/colors';
import * as productsActions from '../../store/actions/products';

function UserProductScreen({ navigation }) {
  const [isLoading, setIsLoading] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState("");
  const userProducts = useSelector(state => state.products.userProducts);
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

  const editProductHandler = (id) => {
    navigation.navigate('EditProduct', { productId: id});
  }

  const deleteHandler = (id) => {
    Alert.alert("Are you Sure?", "Do you really want to delete this item?", [
      {text: "No", style: "default" },
      {
        text: "Yes", 
        style: "destructive", 
        onPress: () => dispatch(productsActions.deleteProduct(id))
      }
    ]);
  };
  
  if (error) {
    return (
      <View style={styles.centered}>
        <Text>{error}</Text>
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

  if (!isLoading && userProducts.length === 0) {
    return (
      <View style={styles.centered}>
        <Text>No Products available. Start adding some.</Text>
      </View>
    );
  }

  return (
    <FlatList 
      onRefresh={loadProducts}
      refreshing={isRefreshing}
      data={userProducts}
      keyExtractor={(item) => item.id}
      renderItem={({ item }) => 
        <ProductItem item={item} onSelect={() => editProductHandler(item.id)}>
          <Button 
            title="Edit" 
            onPress={() => editProductHandler(item.id)} 
            color={colors.primary}
          />
          <Button 
            title="Delete" 
            onPress={() => deleteHandler(item.id)}
            color={colors.primary}
          />
        </ProductItem>
      }
    />
  );
}

UserProductScreen.navigationOptions = (navData) => {
  return {
    headerTitle: "Your Products",
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
          title="Create" 
          iconName="ios-create" 
          onPress={() => {navData.navigation.navigate('EditProduct')}} 
        />
      </HeaderButtons>
    ),
  };  
}

const styles = StyleSheet.create({
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center"
  }
})

export default UserProductScreen;