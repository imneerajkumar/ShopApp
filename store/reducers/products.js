import Product from "../../models/product";
import { CREATE_PRODUCT, DELETE_PRODUCT, SET_PRODUCTS, UPDATE_PRODUCT } from "../actions/products";

const initialState = {
  availableProducts: [],
  userProducts: []
};

export default (state=initialState , action) => {
  switch (action.type) {
    case SET_PRODUCTS: 
      return {
        ...state,
        availableProducts: action.products,
        userProducts: action.userProducts
      };

    case CREATE_PRODUCT:
      const newProduct = new Product(
        action.id,
        action.ownerId,
        action.pushToken,
        action.title,
        action.imageUrl,
        action.description,       
        action.price
      );
      return {
        ...state,
        availableProducts: state.availableProducts.concat(newProduct),
        userProducts: state.userProducts.concat(newProduct)
      };

    case UPDATE_PRODUCT:
      const prodIndex = state.userProducts.findIndex(prod => prod.id === action.pid);
      const availableProdIndex = state.availableProducts.findIndex(prod => prod.id === action.pid);
      const updatedProduct = new Product(
        action.pid,
        state.userProducts[prodIndex].ownerId,
        state.userProducts[prodIndex].pushToken,
        action.title,
        action.imageUrl,
        action.description,
        state.userProducts[prodIndex].price
      );
      const updatedUserProducts = [...state.userProducts];
      updatedUserProducts[prodIndex] = updatedProduct;
      const updatedAvailableProducts = [...state.availableProducts];
      updatedAvailableProducts[availableProdIndex] = updatedProduct;
      return {
        ...state,
        availableProducts: updatedAvailableProducts,
        userProducts: updatedUserProducts
      };

    case DELETE_PRODUCT:
      return {
        ...state,
        userProducts: state.userProducts.filter(product => product.id !== action.pid),
        availableProducts: state.availableProducts.filter(product => product.id !== action.pid)
      }
  
    default:
      return state;
  }
};