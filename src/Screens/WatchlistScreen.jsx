import React, { useState, useEffect } from 'react';
import {
  View,
  RefreshControl,
  FlatList,
  Dimensions,
  StyleSheet,
  Text,
} from 'react-native';
import { useWatchList } from '../contexts/WatchlistContext';
import CoinItem from '../components/CoinItem';
import { getWatchlistedCoins } from '../services/requests';

import { BannerAd, TestIds } from '@react-native-admob/admob';

const WatchlistScreen = () => {
  const deviceWith = Dimensions.get('window').width.toFixed(0);
  const adUnitId = __DEV__
    ? TestIds.BANNER
    : 'ca-app-pub-7783290067270835/6942872205';

  const { watchlistCoinIds } = useWatchList();

  const [coins, setCoins] = useState([]);
  const [loading, setLoading] = useState(false);

  const transformCoins = () => watchlistCoinIds.join('%2C');

  const fetchWatchlistedCoins = async () => {
    if (loading) {
      return;
    }
    setLoading(true);
    const watchlistedCoinsData =
      (await getWatchlistedCoins(1, transformCoins())) || [];
    setCoins(watchlistedCoinsData);
    setLoading(false);
  };

  useEffect(() => {
    if (watchlistCoinIds.length > 0) {
      fetchWatchlistedCoins();
    } else {
      setCoins([]);
    }
  }, [watchlistCoinIds]);

  return (
    <View style={{ flex: 1, justifyContent: 'space-between' }}>
      {coins.length === 0 && (
        <>
          <Text style={styles.placeholder}>No Coins to Watch List</Text>
          <Text style={styles.placeholder}>
            Please add coins to your watchlist just by staring the choice of
            your coin
          </Text>
        </>
      )}
      <FlatList
        data={coins}
        renderItem={({ item }) => <CoinItem marketCoin={item} />}
        refreshControl={
          <RefreshControl
            refreshing={loading}
            tintColor={'white'}
            onRefresh={fetchWatchlistedCoins}
          />
        }
      />

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

export default WatchlistScreen;

const styles = StyleSheet.create({
  placeholder: {
    color: 'white',
    fontSize: 18,
    alignSelf: 'center',
    marginTop: 30,
    textAlign: 'center',
  },
  adContainer: {
    marginTop: 1,
    height: 70,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
});
