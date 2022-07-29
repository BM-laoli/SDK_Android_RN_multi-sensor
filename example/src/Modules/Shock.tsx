import * as React from 'react';

import { StyleSheet, View, Button } from 'react-native';
import MySDK from '../nativeModule';
const { vibrator } = MySDK;

export default function App() {
  return (
    <View style={styles.container}>
      <View style={styles.controller}>
        <Button
          onPress={() => {
            vibrator();
          }}
          title="震动"
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    backgroundColor: '#bae7ff',
  },
  videoWrapper: {
    width: 300,
    height: 300,
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
  },
  controller: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'center',
    padding: 8,
    backgroundColor: '#fff',
  },
});
