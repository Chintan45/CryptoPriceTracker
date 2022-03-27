import React, {memo} from 'react';
import {StyleSheet, Text, View, Image} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import FontAwesome from 'react-native-vector-icons/FontAwesome';

import {useNavigation} from '@react-navigation/native';
import {useWatchList} from '../../contexts/WatchlistContext';

const CoinDetailsHeader = props => {
  const {coinId, symbol, image, market_cap_rank} = props;
  const navigation = useNavigation();
  const {watchlistCoinIds, storeWatchlistCoinId, removeWatchlistCoinId} =
    useWatchList();

  const checkIfCoinWatchlisted = () =>
    watchlistCoinIds.some(coinIdValue => coinIdValue === coinId);

  const handleWatchlistCoin = () => {
    if (checkIfCoinWatchlisted()) {
      return removeWatchlistCoinId(coinId);
    }
    return storeWatchlistCoinId(coinId);
  };

  return (
    <View style={styles.herderContainer}>
      <Ionicons
        name="chevron-back-sharp"
        size={30}
        color="white"
        onPress={() => navigation.goBack()}
      />
      <View style={styles.tickerContainer}>
        <Image source={{uri: image}} style={{width: 25, height: 25}} />
        <Text style={styles.tickerTitle}>{symbol.toUpperCase()}</Text>
        <View style={styles.rankContainer}>
          <Text style={styles.temp}>#{market_cap_rank}</Text>
        </View>
      </View>
      <FontAwesome
        name={checkIfCoinWatchlisted() ? 'star' : 'star-o'}
        size={30}
        color={checkIfCoinWatchlisted() ? '#ffbf00' : 'white'}
        onPress={handleWatchlistCoin}
      />
    </View>
  );
};

export default memo(CoinDetailsHeader);

const styles = StyleSheet.create({
  herderContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  tickerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  tickerTitle: {
    color: 'white',
    fontWeight: 'bold',
    marginHorizontal: 5,
    fontSize: 17,
  },
  temp: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 15,
  },
  rankContainer: {
    backgroundColor: '#585858',
    paddingHorizontal: 5,
    paddingVertical: 2,
    borderRadius: 5,
    marginRight: 5,
  },
});
