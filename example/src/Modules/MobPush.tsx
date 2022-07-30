import React, { useEffect, useRef } from 'react';
import { Button, View, StyleSheet, NativeEventEmitter } from 'react-native';
import MobPushManger, { initPush } from '../nativeModule/mobPush';

const MobPush = () => {
  const eventListenerRef = useRef<any>(null);

  useEffect(() => {
    const eventEmitter = new NativeEventEmitter(MobPushManger);
    eventListenerRef.current = eventEmitter.addListener(
      'EventReminder',
      (event) => {
        console.log(event); // "someValue"
        const valueOBJ = JSON.parse(event.exObject);
        console.log(typeof valueOBJ);
        console.log(valueOBJ.key1);
      }
    );
    return () => {
      eventListenerRef.current?.remove();
    };
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.controller}>
        <Button
          onPress={() => {
            // WifiManager.Request();
            initPush();
          }}
          title="初始化推送"
        />
        <Button
          onPress={async () => {
            // setShow(true);
          }}
          title="获取链接"
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    backgroundColor: '#bae7ff',
  },
  listWrap: {
    width: '80%',
    height: '80%',
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
    justifyContent: 'space-between',
    padding: 8,
    backgroundColor: '#fff',
  },
});

export default MobPush;
