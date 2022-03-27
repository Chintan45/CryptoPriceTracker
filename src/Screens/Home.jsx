import React, { useEffect, useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  FlatList,
  StatusBar,
  RefreshControl,
  Dimensions,
} from 'react-native';
import CoinItem from '../components/CoinItem';
import { getMarketData } from '../services/requests';
import { BannerAd, TestIds } from '@react-native-admob/admob';

const HomeScreen = () => {
  const [coins, setCoins] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchCoins = async pageNumber => {
    if (loading) {
      return;
    }
    setLoading(true);
    const coinsData = await getMarketData(pageNumber);
    // prettier-ignore
    setCoins((existingCoins) => ([...existingCoins, ...coinsData]));
    setLoading(false);
  };

  const refetchCoins = async () => {
    if (loading) {
      return;
    }
    setLoading(true);
    const coinsData = await getMarketData();
    setCoins(coinsData);
    setLoading(false);
  };

  useEffect(() => {
    fetchCoins();
  }, []);

  const deviceWith = Dimensions.get('window').width.toFixed(0);
  const adUnitId = __DEV__
    ? TestIds.BANNER
    : 'ca-app-pub-7783290067270835/6942872205';
  return (
    <View style={styles.container}>
      <Text
        style={{
          color: 'white',
          fontSize: 25,
          fontFamily: 'DroidSans',
          letterSpacing: 1,
          paddingHorizontal: 20,
          paddingBottom: 10,
        }}
      >
        Crypto Assets
      </Text>
      <FlatList
        data={coins}
        initialNumToRender={15}
        renderItem={({ item }) => <CoinItem marketCoin={item} />}
        // prettier-ignore
        onEndReached={() => fetchCoins((coins.length / 30) + 1)}
        refreshControl={
          <RefreshControl
            refreshing={loading}
            tintColor={'white'}
            onRefresh={refetchCoins}
          />
        }
      />
      <StatusBar style="light" />
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

export default HomeScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    fontSize: 32,
  },
  adContainer: {
    marginTop: 1,
    height: 70,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
});
