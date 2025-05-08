import React, { useState } from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { DrawerContentScrollView, DrawerItemList } from '@react-navigation/drawer';
import * as ImagePicker from 'expo-image-picker';

export default function CustomDrawerContent(props) {
  const [profileImage, setProfileImage] = useState(null);
  const [userName, setUserName] = useState('Resident');

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.canceled) {
      setProfileImage(result.assets[0].uri);
    }
  };

  const editName = () => {
    Alert.prompt(
      'Edit Name',
      'Enter your name',
      (text) => {
        if (text) {
          setUserName(text);
        }
      }
    );
  };

  return (
    <DrawerContentScrollView {...props} contentContainerStyle={{ flex: 1 }}>
      <View style={styles.header}>
        <TouchableOpacity onPress={pickImage}>
          <Image
            source={profileImage ? { uri: profileImage } : require('./assets/default-avatar.png')}
            style={styles.avatar}
          />
        </TouchableOpacity>
        <TouchableOpacity onPress={editName}>
          <Text style={styles.name}>{userName}</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.menu}>
        <DrawerItemList {...props} />
      </View>

      <View style={styles.footer}>
        <Text style={styles.footerText}>Smart Waste Management</Text>
      </View>
    </DrawerContentScrollView>
  );
}

const styles = StyleSheet.create({
  header: {
    alignItems: 'center',
    paddingVertical: 30,
    backgroundColor: '#00BFFF',
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginBottom: 10,
    borderWidth: 2,
    borderColor: '#fff',
    backgroundColor: '#ccc', // Gray background for empty image
  },
  name: {
    fontSize: 18,
    color: '#fff',
    fontWeight: 'bold',
  },
  menu: {
    flex: 1,
    backgroundColor: '#fff',
    paddingTop: 10,
  },
  footer: {
    padding: 20,
    backgroundColor: '#eee',
  },
  footerText: {
    fontSize: 14,
    textAlign: 'center',
    color: '#888',
  },
});
