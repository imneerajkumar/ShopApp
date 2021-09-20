import Product from "../../models/product";
import * as Notifications from 'expo-notifications';
import * as firebase from 'firebase';
import firebaseConfig from '../../constants/firebase';

export const DELETE_PRODUCT = 'DELETE_PRODUCT';
export const CREATE_PRODUCT = 'CREATE_PRODUCT';
export const UPDATE_PRODUCT = 'UPDATE_PRODUCT';
export const SET_PRODUCTS = 'SET_PRODUCTS';

export const uploadImage = async (uri) => {
  if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
  }

  const blob = await new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.onload = function () {
      resolve(xhr.response);
    };
    xhr.onerror = function () {
      reject(new TypeError("Network request failed"));
    };
    xhr.responseType = "blob";
    xhr.open("GET", uri, true);
    xhr.send(null);
  });

  const ref = firebase.storage().ref().child(new Date().toISOString());
  const snapshot = await ref.put(blob);
  blob.close();

  return await snapshot.ref.getDownloadURL();
}

export const fetchProducts = () => {
  return async (dispatch, getState) => {
    const userId = getState().auth.userId;
    try {
      const response = await fetch(
        'https://shopapp-d0c44-default-rtdb.firebaseio.com/products.json'
      );

      if (!response.ok) {
        throw new Error("Something goes wrong!!");
      }

      const resData = await response.json();
      const loadedProducts = [];
      
      for (const key in resData) {
        loadedProducts.push(new Product(
          key, 
          resData[key].ownerId,
          resData[key].ownerPushToken, 
          resData[key].title, 
          resData[key].imageUrl, 
          resData[key].description,
          resData[key].price
        ))
      }
      dispatch({ 
        type: SET_PRODUCTS, 
        products: loadedProducts, 
        userProducts: loadedProducts.filter(prod => prod.ownerId === userId) 
      });
    } catch (err) {
      // send to custom analytic server
      throw err;
    }    
  };
};

export const createProduct = (title, uri, description, price) => {
  return async (dispatch, getState) => {
    let pushToken = null;
    const settings = await Notifications.getPermissionsAsync();
    if (!settings.granted) {
      const { status } = await Notifications.requestPermissionsAsync({
        ios: {
          allowAlert: true,
          allowBadge: true,
          allowSound: true,
          allowAnnouncements: true,
        },
      });
      if (status === 'granted') {
        pushToken = (await Notifications.getExpoPushTokenAsync()).data;
      } 
    } else {
      pushToken = (await Notifications.getExpoPushTokenAsync()).data;
    }

    const token = getState().auth.token;
    const userId = getState().auth.userId;
    const imageUrl = await uploadImage(uri);
    const response = await fetch(`https://shopapp-d0c44-default-rtdb.firebaseio.com/products.json?auth=${token}`, 
    {
      method: "POST",
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        title, 
        description, 
        imageUrl, 
        price, 
        ownerId: userId,
        ownerPushToken: pushToken
      })
    })

    const resData = await response.json();
    dispatch({ 
      type: CREATE_PRODUCT,
      id: resData.name,
      ownerId: userId,
      pushToken: pushToken,
      title: title,
      imageUrl: imageUrl,
      description: description,
      price: price,
    });
  };
};

export const updateProduct = (id, title, uri, description) => {
  return async (dispatch, getState) => {
    const token = getState().auth.token;
    const imageUrl = await uploadImage(uri);
    const response = await fetch(`https://shopapp-d0c44-default-rtdb.firebaseio.com/products/${id}.json?auth=${token}`, 
    {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({title, imageUrl, description})
    });

    if (!response.ok) {
      throw new Error("Something goes wrong!!");
    }
  
    dispatch({ 
      type: UPDATE_PRODUCT,
      pid: id,
      title: title,
      imageUrl: imageUrl,
      description: description
    });
  };
};

export const deleteProduct = (productId) => {
  return async (dispatch, getState) => {
    const token = getState().auth.token;
    const response = await fetch(`https://shopapp-d0c44-default-rtdb.firebaseio.com/products/${productId}.json?auth=${token}`, 
    {
      method: "DELETE"
    })

    if (!response.ok) {
      throw new Error("Something goes wrong!!");
    }

    dispatch({ type: DELETE_PRODUCT, pid: productId});
  };
};