import React, { Suspense } from 'react';
import { View, FlatList, Text, Dimensions, StyleSheet } from 'react-native';
import PortfolioAssetsList from './screenComponents/PortfolioAssetsList';
import { BannerAd, TestIds } from '@react-native-admob/admob';

const PortfolioScreen = () => {
  const deviceWith = Dimensions.get('window').width.toFixed(0);
  const adUnitId = __DEV__
    ? TestIds.BANNER
    : 'ca-app-pub-7783290067270835/6942872205';
  return (
    <View style={{ flex: 1 }}>
      <Suspense
        fallback={<Text style={{ color: 'white' }}>Loading Please Wait!</Text>}
      >
        <PortfolioAssetsList />
      </Suspense>
      <View style={styles.adContainer}>
        <BannerAd
          size={`${deviceWith}x70`}
          unitId={adUnitId}
          onAdFailedToLoad={error => console.error(error)}
        />
      </View>
    </View>
  );
};

export default PortfolioScreen;

const styles = StyleSheet.create({
  adContainer: {
    marginTop: 1,
    height: 70,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
});
