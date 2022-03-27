import React from 'react';
import { StyleSheet, View, Text, StatusBar, Image } from 'react-native';
const SplashScreen = () => {
  return (
    <View style={styles.container}>
      <Image
        source={require('../assets/logo2.gif')}
        style={{
          width: 120,
          height: 120,
        }}
      />
      <Text style={styles.tagline}>Powered by Yo Apps!!</Text>
      <StatusBar style="light" />
    </View>
  );
};

export default SplashScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    fontSize: 32,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#121212',
  },
  header: {
    color: 'white',
    fontSize: 25,
    fontFamily: 'DroidSans',
    letterSpacing: 1,
    paddingHorizontal: 20,
    paddingBottom: 10,
  },
  tagline: {
    color: 'white',
    fontSize: 18,
    position: 'absolute',
    bottom: 30,
  },
});
