import React, { useState, useEffect } from 'react';
import { View, TextInput, StyleSheet, Text, Pressable } from 'react-native';
import SearchableDropdown from 'react-native-searchable-dropdown';
import { useRecoilState } from 'recoil';
import { allPortfolioBoughtAssetsInStorage } from '../atoms/PortfolioAssets';
import { getAllCoins, getDetailedCoinData } from '../services/requests';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import uuid from 'react-native-uuid';

const AddNewAssetScreen = () => {
  const [allCoins, setAllCoins] = useState([]);
  const [boughtAssetQuantity, setBoughtAssetQuantity] = useState('');
  const [loading, setLoading] = useState(false);
  const [selectedCoinId, setSelectedCoinId] = useState(null);
  const [selectedCoin, setSelectedCoin] = useState(null);

  const [assetsInStorage, setAssetsInStorage] = useRecoilState(
    allPortfolioBoughtAssetsInStorage,
  );

  const navigation = useNavigation();

  const isQuantityEntered = () => boughtAssetQuantity === '';

  const fetchAllCoins = async () => {
    if (loading) {
      return;
    }
    setLoading(true);
    const allCoins = await getAllCoins();
    setAllCoins(allCoins);
    setLoading(false);
  };

  const fetchCoinInfo = async () => {
    if (loading) {
      return;
    }
    setLoading(true);
    const coinInfo = await getDetailedCoinData(selectedCoinId);
    setSelectedCoin(coinInfo);
    setLoading(false);
  };

  useEffect(() => {
    fetchAllCoins();
  }, []);

  useEffect(() => {
    if (selectedCoinId) {
      fetchCoinInfo();
    }
  }, [selectedCoinId]);

  const onAddNewAsset = async () => {
    const newAsset = {
      id: selectedCoin.id,
      unique_id: selectedCoin.id + uuid.v4(),
      name: selectedCoin.name,
      image: selectedCoin.image.small,
      ticker: selectedCoin.symbol.toUpperCase(),
      quantityBought: parseFloat(boughtAssetQuantity),
      priceBought: selectedCoin.market_data.current_price.usd,
    };
    const newAssets = [...assetsInStorage, newAsset];
    const jsonValue = JSON.stringify(newAssets);
    await AsyncStorage.setItem('@portfolio_coins', jsonValue);
    setAssetsInStorage(newAssets);
    navigation.goBack();
  };

  return (
    <View style={{ flex: 1 }}>
      <SearchableDropdown
        items={allCoins}
        onItemSelect={item => setSelectedCoinId(item.id)}
        containerStyle={styles.dropdownContainer}
        itemStyle={styles.item}
        itemTextStyle={{ color: 'white' }}
        resetValue={false}
        placeholder={selectedCoinId || 'Select a coin...'}
        placeholderTextColor="white"
        textInputProps={{
          underlineColorAndroid: 'transparent',
          style: styles.textinput,
        }}
      />
      {selectedCoin && (
        <>
          <View style={styles.boughtQuantityContainer}>
            <View style={{ flexDirection: 'row' }}>
              <TextInput
                style={{ color: 'white', fontSize: 60 }}
                value={boughtAssetQuantity}
                placeholder="0"
                keyboardType="numeric"
                onChangeText={setBoughtAssetQuantity}
              />
              <Text style={styles.ticker}>
                {selectedCoin.symbol.toUpperCase()}
              </Text>
            </View>
            <Text style={styles.pricePerCoin}>
              ${selectedCoin.market_data.current_price.usd} per coin
            </Text>
          </View>
          <Pressable
            style={{
              ...styles.buttonContainer,
              backgroundColor: isQuantityEntered() ? '#303030' : '#4169E1',
            }}
            onPress={onAddNewAsset}
            disabled={isQuantityEntered()}
          >
            <Text
              style={{
                ...styles.buttonText,
                color: isQuantityEntered() ? 'grey' : 'white',
              }}
            >
              Add New Asset
            </Text>
          </Pressable>
        </>
      )}
    </View>
  );
};

export default AddNewAssetScreen;

const styles = StyleSheet.create({
  dropdownContainer: {
    width: '100%',
    paddingHorizontal: 10,
    paddingVertical: 20,
  },
  item: {
    padding: 10,
    marginTop: 2,
    backgroundColor: '#1e1e1e',
    borderWidth: 1,
    borderColor: '#444444',
    borderRadius: 5,
  },
  textinput: {
    padding: 12,
    borderWidth: 1.5,
    borderColor: '#444444',
    borderRadius: 5,
    backgroundColor: '#1e1e1e',
    color: 'white',
  },
  ticker: {
    color: 'grey',
    fontSize: 20,
    fontWeight: '700',
    marginTop: 25,
    marginLeft: 5,
  },
  boughtQuantityContainer: {
    flex: 1,
    alignItems: 'center',
    marginTop: 50,
  },
  buttonContainer: {
    padding: 10,
    alignItems: 'center',
    marginVertical: 30,
    marginHorizontal: 20,
    borderRadius: 5,
  },
  buttonText: {
    fontWeight: '600',
    fontSize: 17,
  },
  pricePerCoin: {
    color: 'grey',
    fontWeight: '700',
    fontSize: 17,
    letterSpacing: 0.5,
  },
});
