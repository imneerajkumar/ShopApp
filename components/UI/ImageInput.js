import React, {useState} from 'react';
import { Button, Image, View, StyleSheet, Text, Alert, Platform } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import colors from '../../constants/colors';

function ImageInput(props) {
  const [image, setImage] = useState(props.initialValue);
  const { onInputChange, id } = props;

  const takeImageHandler = async () => {
    if (Platform.OS !== 'web') {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert(
          "Error",
          "This feature requires permissions for Gallery."
          [{ text: "Okay" }]
        );
        return;
      }
    }

    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.cancelled) {
      onInputChange(id, result.uri, true);
      setImage(result.uri);
    }
  };

  return (
    <View style={styles.imageInput}>
      <Text style={styles.label}>{props.label}</Text>
      <View style={styles.imageContainer}>
        {image ? (
          <Image source={{ uri: image }} style={styles.image} />
        ) : (
          <Text style={styles.error}>No Image Selected!!</Text>
        )}
      </View>
      <Button 
        title="Select an Image" 
        color={colors.primary} 
        onPress={takeImageHandler}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  imageInput: {
    width: "100%"
  },
  label: {
    fontFamily: "open-sans-bold",
    marginVertical: 8
  },
  imageContainer: {
    width: "100%",
    height: 200,
    justifyContent: "center",
    alignItems: "center",
    borderColor: colors.grey,
    borderWidth: 1,
    borderRadius: 10,
    overflow: "hidden",
    marginBottom: 10
  },
  image: {
    width: "100%",
    height: "100%"
  },
  error: {
    fontFamily: "open-sans",
    color: colors.primary,
    fontSize: 14
  },
})

export default ImageInput;