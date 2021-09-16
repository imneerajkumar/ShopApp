import React, { useEffect, useState } from 'react';
import { FlatList, View, ActivityIndicator, StyleSheet, Text } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { HeaderButtons, Item } from 'react-navigation-header-buttons'

import colors from '../../constants/colors';
import HeaderButton from '../../components/UI/HeaderButton';
import OrderItem from '../../components/shop/OrderItem';
import * as ordersActions from '../../store/actions/orders';

function OrdersScreen(props) {
  const [isLoading, setIsLoading] = useState(false);
  const orders = useSelector(state => state.orders.orders);
  const dispatch = useDispatch();

  useEffect(() =>{
    setIsLoading(true);
    dispatch(ordersActions.fetchOrders()).then(() => {
      setIsLoading(false);
    });
  }, [dispatch]);

  if (isLoading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color={colors.accent} />
      </View>
    );
  }

  if(orders.length === 0) {
    return (
      <View style={styles.centered}>
        <Text>No orders yet. Start ordering now.</Text>
      </View>
    );
  }

  return (
    <FlatList 
      data={orders}
      keyExtractor={(item) => item.id}
      renderItem={({ item }) => 
        <OrderItem 
          amount={item.totalAmount}
          date={item.readableDate}
          items={item.items}
        />
      }
    />
  );
}

OrdersScreen.navigationOptions = (navData) => {
  return {
    headerTitle: "Your Orders",
    headerLeft: () => (
      <HeaderButtons HeaderButtonComponent={HeaderButton}>
        <Item 
          title="Menu" 
          iconName="ios-menu" 
          onPress={() => {navData.navigation.toggleDrawer()}} 
        />
      </HeaderButtons>
    ),
  };
};

const styles = StyleSheet.create({
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center"
  }
})

export default OrdersScreen;