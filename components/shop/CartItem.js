import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons'
import colors from '../../constants/colors';

function CartItem({ item, onRemove, deleteable }) {
  return (
    <View style={styles.cartItem}>
      <View style={styles.itemData}>
        <Text style={styles.text}>{item.quantity} </Text>
        <Text style={styles.text}>{item.productTitle}</Text>
      </View>
      <View style={styles.itemData}>
        <Text style={styles.text}>${item.sum.toFixed(2)}</Text>
        {deleteable && 
          <TouchableOpacity onPress={onRemove} style={styles.deleteButton}>
            <Ionicons 
              name="trash"
              size={23}
              color="red"
            />
          </TouchableOpacity>
        }
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  cartItem: {
    padding: 20,
    backgroundColor: colors.white,
    flexDirection: "row",
    justifyContent: "space-between",
    marginHorizontal: 20
  },
  itemData: {
    flexDirection: "row",
    alignItems: "center"
  },
  text: {
    fontFamily: "open-sans-bold",
    fontSize: 16,
    color: colors.grey,
  },
  deleteButton: {
    marginLeft: 20
  },
})

export default CartItem;