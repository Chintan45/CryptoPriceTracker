import React, {memo} from 'react';
import {StyleSheet, Text, Pressable} from 'react-native';

const FilterComponent = ({
  filterDay,
  filterText,
  selectedRange,
  setSelectedRange,
}) => {
  const isFilterSelected = filter => filter === selectedRange;

  return (
    <Pressable
      style={{
        paddingHorizontal: 10,
        paddingVertical: 5,
        borderRadius: 5,
        backgroundColor: isFilterSelected(filterDay)
          ? '#1e1e1e'
          : 'transparent',
      }}
      onPress={() => setSelectedRange(filterDay)}>
      <Text style={{color: isFilterSelected(filterDay) ? 'white' : 'grey'}}>
        {filterText}
      </Text>
    </Pressable>
  );
};

export default memo(FilterComponent);
