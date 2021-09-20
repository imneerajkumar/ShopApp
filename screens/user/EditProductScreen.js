import React, { useState, useCallback, useEffect, useReducer } from 'react';
import { StyleSheet, View, ScrollView, Alert, KeyboardAvoidingView, ActivityIndicator } from 'react-native';
import { HeaderButtons, Item } from 'react-navigation-header-buttons'
import { useSelector, useDispatch } from 'react-redux';

import HeaderButton from '../../components/UI/HeaderButton';
import Input from '../../components/UI/Input';
import * as productsAction from '../../store/actions/products';
import colors from '../../constants/colors';
import ImageInput from '../../components/UI/ImageInput';

const formReducer = (state, action) => {
  if (action.type === 'UPDATE') {
    const updatedValues = {
      ...state.inputValues,
      [action.input]: action.value
    };
    const updatedValidities = {
      ...state.inputValidities,
      [action.input]: action.isValid
    };
    let updatedFormIsValid = true;
    for (const key in updatedValidities) {
      updatedFormIsValid = updatedFormIsValid && updatedValidities[key];
    }
    return {
      inputValues: updatedValues,
      inputValidities: updatedValidities,
      formIsValid: updatedFormIsValid
    };
  }
  return state;
};

function EditProductScreen({ navigation }) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const prodId = navigation.getParam('productId');
  const editedProduct = useSelector(state => 
    state.products.userProducts.find(prod => prod.id === prodId)
  );
  const dispatch = useDispatch();

  const [formState, dispatchForm] =  useReducer(formReducer, {
    inputValues: {
      title: editedProduct ? editedProduct.title : "",
      imageUrl: editedProduct ? editedProduct.imageUrl : "",
      description: editedProduct ? editedProduct.description : "",
      price: ""
    }, 
    inputValidities: {
      title: editedProduct ? true : false,
      imageUrl: editedProduct ? true : false,
      description: editedProduct ? true : false,
      price: editedProduct ? true : false
    }, 
    formIsValid: editedProduct ? true : false
  });

  useEffect(() => {
    if (error) {
      Alert.alert('An error Occured', error, [{text: "Okay"}])
    }
  }, [error])

  const submitHandler = useCallback(async () => {
    if(!formState.formIsValid) {
      Alert.alert("Wrong Input", "Chech errors in input", [{text: "Okay"}])
      return;
    }

    setError(null);
    setIsLoading(true);
    try {
      if (editedProduct) {
        await dispatch(productsAction.updateProduct(
          prodId, 
          formState.inputValues.title, 
          formState.inputValues.imageUrl, 
          formState.inputValues.description
        ));
      } else {
        await dispatch(productsAction.createProduct(
          formState.inputValues.title, 
          formState.inputValues.imageUrl, 
          formState.inputValues.description,
          +formState.inputValues.price
        ));
      }
      navigation.goBack();
    } catch {
      setError(err.message);
    }
    setIsLoading(false);
  }, [dispatch, prodId, formState]);

  useEffect(() => {
    navigation.setParams({ submit: submitHandler })
  }, [submitHandler]);

  const inputChangeHandler = useCallback((inputIdentifier, inputValue, inputValidity) => {
    dispatchForm({ 
      type: 'UPDATE', 
      value: inputValue,
      isValid: inputValidity,
      input: inputIdentifier
    });
  }, [dispatchForm]);

  if (isLoading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color={colors.accent} />
      </View>
    );
  }

  return (
    <KeyboardAvoidingView style={{ flex: 1}} behavior="padding" keyboardVerticalOffset={10}>
      <ScrollView>
        <View style={styles.form}>
          <Input 
            id="title"
            label="Title"
            errorText="Please enter a valid title!"
            keyboardType="default"
            autoCapitalize="sentences"
            autoCorrect
            returnKeyType="next"
            onInputChange={inputChangeHandler}
            initialValue={editedProduct ? editedProduct.title : ""}
            initiallyValid={editedProduct ? true : false}
            required
          />
          <ImageInput 
            id="imageUrl"
            label="Image"
            onInputChange={inputChangeHandler}
            initialValue={editedProduct ? editedProduct.imageUrl : ""}
            initiallyValid={editedProduct ? true : false}
            required
          />
          {editedProduct ? null : (
            <Input 
              id="price"
              label="Price"
              errorText="Please enter a valid Price!"
              keyboardType="decimal-pad"
              returnKeyType="next"
              onInputChange={inputChangeHandler}
              initialValue=""
              initiallyValid={editedProduct ? true : false}
              required
              min={0.1}
            />
          )}
          <Input 
            id="description"
            label="Description"
            errorText="Please enter a valid description!"
            keyboardType="default"
            autoCapitalize="sentences"
            autoCorrect
            multiline
            numberOfLines={3}
            onInputChange={inputChangeHandler}
            initialValue={editedProduct ? editedProduct.description : ""}
            initiallyValid={editedProduct ? true : false}
            required
            minLength={5}
          />
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

EditProductScreen.navigationOptions = (navData) => {
  return {
    headerTitle: navData.navigation.getParam('productId') ? "Edit Product" : "Add Product",
    headerRight: () => (
      <HeaderButtons HeaderButtonComponent={HeaderButton}>
        <Item 
          title="Save" 
          iconName="ios-checkmark" 
          onPress={navData.navigation.getParam("submit")} 
        />
      </HeaderButtons>
    )
  };
};

const styles = StyleSheet.create({
  form: {
    margin: 20
  },
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center"
  }
})

export default EditProductScreen;