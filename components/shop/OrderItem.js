import React, { useState } from 'react';
import { StyleSheet, View, Text, Button } from 'react-native';

import colors from '../../constants/colors';
import Card from '../UI/Card';
import CartItem from './CartItem';

function OrderItem({ amount, date, items }) {
  const [showDetails, setShowDetails] = useState(false);

  return (
    <Card style={styles.orderItem}>
      <View style={styles.summary}>
        <Text style={styles.amount}>${amount.toFixed(2)}</Text>
        <Text style={styles.date}>{date}</Text>
      </View>
      <Button 
        title={showDetails ? "Hide Details" : "Show Details"}
        color={colors.primary}
        onPress={() => setShowDetails(prevState => !prevState)}
      />
      {
        showDetails && items.map((item) => 
          <View style={styles.details} key={item.productId}>
            <CartItem item={item} />
          </View>
        )
      }
    </Card>
  );
}

const styles = StyleSheet.create({
  orderItem: {
    margin: 20,
    padding: 10,
    alignItems: "center"
  },
  summary: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    width: "100%",
    marginBottom: 15
  },
  amount: {
    fontFamily: "open-sans-bold",
    fontSize: 16
  },
  date: {
    fontFamily: "open-sans",
    fontSize: 16,
    color: colors.grey
  },
  details: {
    width: "100%"
  },
})

export default OrderItem;