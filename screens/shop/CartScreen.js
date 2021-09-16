import React, { useState } from 'react';
import { StyleSheet, View, Text, FlatList, Button, ActivityIndicator } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';

import CartItem from '../../components/shop/CartItem';
import Card from '../../components/UI/Card';
import colors from '../../constants/colors';
import * as cartActions from '../../store/actions/cart';
import * as orderActions from '../../store/actions/orders';

function CartScreen(props) {
  const [isLoading, setIsLoading] = useState(false);

  const cartTotalAmount = useSelector(state => state.cart.totalAmount);
  const cartItems = useSelector(state => {
    const transformedCartItems = [];
    for (const key in state.cart.items) {
      transformedCartItems.push({
        productId: key,
        productTitle: state.cart.items[key].productTitle,
        productPrice: state.cart.items[key].productPrice,
        quantity: state.cart.items[key].quantity,
        sum: state.cart.items[key].sum,
        productPushToken: state.cart.items[key].pushToken
      });
    }
    return transformedCartItems.sort((a, b) => 
      a.productId > b.productId ? 1 : -1
    );
  });

  const dispatch = useDispatch();

  const sendOrderHandler = async () => {
    setIsLoading(true);
    await dispatch(orderActions.addOrder(cartItems, cartTotalAmount));
    setIsLoading(false);
  }


  return (
    <View style={styles.screen}>
      <Card style={styles.summary}>
        <Text style={styles.summaryText}>
          Total: <Text style={styles.amount}>${Math.round(cartTotalAmount.toFixed(2) * 100) / 100}</Text>
        </Text>
        {isLoading ? (
          <ActivityIndicator size="large" color={colors.accent} />
        ) : (
          <Button 
            title="Order Now" 
            color={colors.accent} 
            disabled={cartItems.length === 0} 
            onPress={sendOrderHandler}
          />
        )}
      </Card>
      <FlatList 
        data={cartItems}
        keyExtractor={(item) => item.productId}
        renderItem={({ item }) => 
          <CartItem 
            item={item} 
            deleteable
            onRemove={() => {
              dispatch(cartActions.removeFromCart(item.productId));
            }} 
          />
        }
      />
    </View>
  );
}

CartScreen.navigationOptions = {
  headerTitle: "Your Cart"
}

const styles = StyleSheet.create({
  screen: {
    margin: 20
  },
  summary: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 20,
    padding: 10,
    borderRadius: 10,
  },
  summaryText: {
    fontFamily: "open-sans-bold",
    fontSize: 18
  },
  amount: {
    color: colors.primary
  },
})

export default CartScreen;