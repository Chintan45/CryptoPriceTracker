import React, { useState, useEffect } from 'react';
import {
  View,
  StyleSheet,
  Text,
  Dimensions,
  TextInput,
  ActivityIndicator,
} from 'react-native';
import { gestureHandlerRootHOC } from 'react-native-gesture-handler';
import { LineChart } from 'react-native-wagmi-charts';
import Icon from 'react-native-vector-icons/AntDesign';
import CoinDetailsHeader from './screenComponents/coinDetailsHeader';
import { useRoute } from '@react-navigation/native';
import { getDetailedCoinData, getCoinMarketChart } from '../services/requests';
import FilterComponent from './screenComponents/FilterComponent';

const filterDaysArray = [
  { filterDay: '1', filterText: '24h' },
  { filterDay: '7', filterText: '7d' },
  { filterDay: '30', filterText: '30d' },
  { filterDay: '365', filterText: '1y' },
  { filterDay: 'max', filterText: 'All' },
];

const CoinDetailsScreen = gestureHandlerRootHOC(({ navigation }) => {
  const route = useRoute();
  const {
    params: { coinId },
  } = route;
  const [coin, setCoin] = useState(null);
  const [coinMarketData, setCoinMarketData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [coinValue, setCoinValue] = useState('1');
  const [usdValue, setUsdValue] = useState('');
  const [selectedRange, setSetectedRange] = useState('1');

  const fecthCoinData = async () => {
    setLoading(true);
    const fecthedCoinData = await getDetailedCoinData(coinId);
    setCoin(fecthedCoinData);
    setUsdValue(fecthedCoinData.market_data.current_price.usd.toString());
    setLoading(false);
  };

  const fetchMarketCoinData = async selectedRangeValue => {
    setLoading(true);
    const fetchedCoinMarketData = await getCoinMarketChart(
      coinId,
      selectedRangeValue,
    );
    setCoinMarketData(fetchedCoinMarketData);
    setLoading(false);
  };

  useEffect(() => {
    fecthCoinData();
    fetchMarketCoinData(1);
  }, []);

  const changeCoinValue = value => {
    setCoinValue(value);
    const floatValue = parseFloat(value) || 0;
    setUsdValue((floatValue * current_price.usd).toFixed(6).toString());
  };

  const changeUsdValue = value => {
    setUsdValue(value);
    const floatValue = parseFloat(value.replace(',', '.')) || 0;
    setCoinValue((floatValue / current_price.usd).toFixed(6).toString());
  };

  if (loading || !coin || !coinMarketData) {
    return <ActivityIndicator size={'large'} style={{ marginTop: 40 }} />;
  }

  const {
    id,
    image: { small },
    name,
    symbol,
    market_data: {
      market_cap_rank,
      current_price,
      price_change_percentage_24h,
    },
  } = coin;
  const { prices } = coinMarketData;

  const percentageColor =
    price_change_percentage_24h < 0 ? '#ea3943' : '#16c784';
  const chartColor = current_price.usd > prices[0][1] ? '#16c784' : '#ea3943';
  const screenWidth = Dimensions.get('window').width;
  const data = prices.map(price => ({ timestamp: price[0], value: price[1] }));

  const onSelectedRangeChange = selectedRangeValue => {
    setSetectedRange(selectedRangeValue);
    fetchMarketCoinData(selectedRangeValue);
  };

  return (
    <View style={styles.container}>
      <LineChart.Provider data={data}>
        <CoinDetailsHeader
          coinId={id}
          name={name}
          image={small}
          symbol={symbol}
          market_cap_rank={market_cap_rank}
        />
        <View style={styles.priceContainer}>
          <View>
            <Text style={styles.name}>{name}</Text>
            {/* <Text style={styles.currentPrice}>${current_price.usd}</Text> */}
            <LineChart.PriceText
              format={({ value }) => {
                'worklet';
                if (value === '') {
                  if (current_price?.usd < 1) {
                    return `$${current_price?.usd}`;
                  }
                  return `$${current_price?.usd?.toFixed(2)}`;
                }
                if (current_price?.usd < 1) {
                  return `$${parseFloat(value)}`;
                }
                return `$${parseFloat(value).toFixed(2)}`;
              }}
              style={styles.currentPrice}
            />
          </View>
          <View
            style={{
              backgroundColor: percentageColor,
              paddingVertical: 5,
              paddingHorizontal: 3,
              borderRadius: 5,
              flexDirection: 'row',
            }}
          >
            <Icon
              name={price_change_percentage_24h < 0 ? 'caretdown' : 'caretup'}
              size={14}
              color="white"
              style={{ alignSelf: 'center', marginRight: 5 }}
            />
            <Text style={styles.priceChange}>
              {price_change_percentage_24h.toFixed(2)}%
            </Text>
          </View>
        </View>

        <View style={styles.filterContainer}>
          {filterDaysArray.map(day => (
            <FilterComponent
              filterDay={day.filterDay}
              filterText={day.filterText}
              selectedRange={selectedRange}
              setSelectedRange={onSelectedRangeChange}
              key={day.filterText}
            />
          ))}
        </View>
        <LineChart height={screenWidth / 2} width={screenWidth}>
          <LineChart.Path color={chartColor} width={2}>
            <LineChart.Gradient />
          </LineChart.Path>
          <LineChart.CursorCrosshair color={chartColor} />
        </LineChart>

        <View style={{ flexDirection: 'row' }}>
          <View style={{ flexDirection: 'row', flex: 1 }}>
            <Text style={{ color: 'white', alignSelf: 'center' }}>
              {symbol.toUpperCase()}
            </Text>
            <TextInput
              style={styles.input}
              keyboardType="numeric"
              value={coinValue}
              onChangeText={changeCoinValue}
            />
          </View>

          <View style={{ flexDirection: 'row', flex: 1 }}>
            <Text style={{ color: 'white', alignSelf: 'center' }}>USD</Text>
            <TextInput
              style={styles.input}
              keyboardType="numeric"
              value={usdValue}
              onChangeText={changeUsdValue}
            />
          </View>
        </View>
      </LineChart.Provider>
    </View>
  );
});

export default CoinDetailsScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    fontSize: 32,
    backgroundColor: '#121212',
    paddingHorizontal: 10,
  },
  priceContainer: {
    padding: 15,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  currentPrice: {
    color: 'white',
    fontSize: 30,
    fontWeight: 'bold',
    letterSpacing: 1,
  },
  name: {
    color: 'white',
    fontSize: 15,
  },
  priceChange: { color: 'white', fontSize: 17, fontWeight: '500' },
  input: {
    flex: 1,
    height: 40,
    margin: 12,
    borderBottomWidth: 1,
    borderBottomColor: 'white',
    color: 'white',
    padding: 10,
    fontSize: 16,
  },
  filterContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: '#2b2b2b',
    paddingVertical: 5,
    borderRadius: 5,
    marginVertical: 10,
  },
});
