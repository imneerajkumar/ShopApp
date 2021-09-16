import React from "react";
import { Platform, View, Button, SafeAreaView } from "react-native";
import { createAppContainer, createSwitchNavigator } from "react-navigation";
import { createStackNavigator } from "react-navigation-stack";
import { createDrawerNavigator, DrawerItems } from "react-navigation-drawer";
import { Ionicons } from '@expo/vector-icons';
import { useDispatch } from "react-redux";

import * as authActions from '../store/actions/auth';
import colors from "../constants/colors";
import ProductsOverviewScreen from "../screens/shop/ProductsOverviewScreen";
import ProductDetailScreen from "../screens/shop/ProductDetailScreen";
import CartScreen from "../screens/shop/CartScreen";
import OrdersScreen from "../screens/shop/OrdersScreen";
import UserProductScreen from "../screens/user/UserProductScreen";
import EditProductScreen from "../screens/user/EditProductScreen";
import AuthScreen from "../screens/user/AuthScreen";
import StartupScreen from "../screens/StartupScreen";

const defaultNavOptions = {
  headerStyle: {
    backgroundColor: Platform.OS === "android" ? colors.primary : ""
  },
  headerTitleStyle: {
    fontFamily: 'open-sans-bold',
  },
  headerBackTitleStyle: {
    fontFamily: 'open-sans',
  },
  headerTintColor: Platform.OS === "android" ? "white" : colors.primary
};

const ProductsNavigator = createStackNavigator({
  ProductOverview: ProductsOverviewScreen,
  ProductDetail: ProductDetailScreen,
  Cart: CartScreen
}, {
  navigationOptions: {
    drawerIcon: drawerConfig => (
      <Ionicons 
        name="ios-cart" 
        size={23}
        color={drawerConfig.tintColor}
      />
    )
  },
  defaultNavigationOptions: defaultNavOptions
});

const OrdersNavigator = createStackNavigator({
  Orders: OrdersScreen
},{
  navigationOptions: {
    drawerIcon: drawerConfig => (
      <Ionicons 
        name="ios-list" 
        size={23}
        color={drawerConfig.tintColor}
      />
    )
  },
  defaultNavigationOptions: defaultNavOptions
});

const AdminNavigator = createStackNavigator({
  UserProducts: UserProductScreen,
  EditProduct: EditProductScreen
},{
  navigationOptions: {
    drawerIcon: drawerConfig => (
      <Ionicons 
        name="ios-create" 
        size={23}
        color={drawerConfig.tintColor}
      />
    )
  },
  defaultNavigationOptions: defaultNavOptions
});

const ShopNavigator = createDrawerNavigator({
  Products: ProductsNavigator,
  Orders: OrdersNavigator,
  Admin: AdminNavigator,
}, {
  hideStatusBar: true,
  contentOptions: {
    activeTintColor: colors.primary
  },
  contentComponent: props => {
    const dispatch = useDispatch();
    return (
      <View style={{ flex: 1, padding: 10}}>
        <SafeAreaView forceInset={{top: 'always', horizontal: 'never'}}>
          <DrawerItems {...props} />
          <Button 
            title="Logout" 
            color={colors.primary} 
            onPress={() => {
              dispatch(authActions.logout());
            }}
          />
        </SafeAreaView>
      </View>
    );
  }
});

const AuthNavigator = createStackNavigator({
  Auth: AuthScreen
}, {
  defaultNavigationOptions: defaultNavOptions
});

const MainNavigator = createSwitchNavigator({
  Startup: StartupScreen,
  Auth: AuthNavigator,
  Shop: ShopNavigator
});

export default createAppContainer(MainNavigator);