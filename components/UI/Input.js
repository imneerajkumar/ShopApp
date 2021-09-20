import React, { useReducer, useEffect } from 'react';
import { StyleSheet, View, Text, TextInput } from 'react-native';
import colors from '../../constants/colors';

const inputReducer = (state, action) => {
  switch (action.type) {
    case 'INPUT_CHANGE':
      return{
        ...state,
        value: action.value,
        isValid: action.isValid
      }
    case 'INPUT_BLUR': 
      return{
        ...state,
        touched: true
      }
    default:
      return state;
  }
};

function Input(props) {
  const [inputState, dispatch] = useReducer(inputReducer, {
    value: props.initialValue ? props.initialValue : "",
    isValid: props.initiallyValid,
    touched: false
  });

  const { onInputChange, id } = props;
  useEffect(() => {
    if (inputState.touched) {
      onInputChange( id, inputState.value, inputState.isValid);
    }
  }, [inputState]);

  const textChangeHandler = (text) => {
    const emailRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    let isValid = true;
    if (props.required && text.trim().length === 0) {
      isValid = false;
    }
    if (props.email && !emailRegex.test(text.toLowerCase())) {
      isValid = false;
    }
    if (props.min != null && +text < props.min) {
      isValid = false;
    }
    if (props.max != null && +text > props.max) {
      isValid = false;
    }
    if (props.minLength != null && text.length < props.minLength) {
      isValid = false;
    }
    dispatch({type: 'INPUT_CHANGE', value: text, isValid: isValid})
  };

  const lostFocusHandler = () => {
    dispatch({ type: 'INPUT_BLUR' })
  };

  return (
    <View style={styles.formControl} >
      <Text style={styles.label}>{props.label}</Text>
      <TextInput 
        {...props}
        style={styles.input} 
        value={inputState.value} 
        onChangeText={textChangeHandler} 
        onBlur={lostFocusHandler}
      />
      {!inputState.value && inputState.touched && (
        <View style={styles.errorContainer}>
          <Text style={styles.error}>{props.errorText}</Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  formControl: {
    width: "100%"
  },
  label: {
    fontFamily: "open-sans-bold",
    marginVertical: 8
  },
  input: {
    paddingHorizontal: 2,
    paddingVertical: 5,
    borderBottomColor: colors.light,
    borderBottomWidth: 2
  },
  errorContainer: {
    marginVertical: 5
  },
  error: {
    fontFamily: "open-sans",
    color: colors.primary,
    fontSize: 14
  }
})

export default Input;