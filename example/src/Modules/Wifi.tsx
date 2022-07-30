import React, { useState } from 'react';
import {
  Button,
  Text,
  View,
  FlatList,
  StyleSheet,
  ToastAndroid,
} from 'react-native';
import VideoPlayer from '../Components/VideoPlayer';
import WifiManager from '../nativeModule/wifi';
import { NativeModules } from 'react-native';

const Item = (props: any) => {
  // console.log(props.item);
  return (
    <View
      style={{
        height: 50,
        width: '100%',
        flexDirection: 'row',
        justifyContent: 'space-between',
      }}
    >
      <Text
        style={{
          fontSize: 18,
        }}
      >
        {props.item.SSID}
      </Text>
      <Button
        onPress={async () => {
          try {
            const value = await WifiManager.connectToProtectedSSID(
              props.item.SSID,
              '11111111',
              true
            );
            // console.log('链接情况', value);
            ToastAndroid.show('链接成功', 2000);
          } catch (error) {
            // console.log('链接情况e', error);
            ToastAndroid.show('链接失败', 2000);
          }
        }}
        title="链接"
      />
    </View>
  );
};

const WIFI = () => {
  const [data, setData] = useState([]);
  const [show, setShow] = useState(false);

  return (
    <View style={styles.container}>
      <View style={styles.listWrap}>
        <FlatList
          // @ts-ignore
          keyExtractor={(item, index) => String(index)}
          data={data}
          renderItem={Item}
        />
      </View>
      <View style={styles.controller}>
        <Button
          onPress={() => {
            WifiManager.Request();
          }}
          title="开启权限"
        />
        <Button
          onPress={async () => {
            WifiManager.reScanAndLoadWifiList(
              (res: any) => {
                const value = JSON.parse(res).filter(
                  (item) =>
                    item.SSID === 'iPhone12bmlaoli' ||
                    item.SSID === 'HUAWEI P40'
                );
                console.log('value', value);

                // @ts-ignore
                setData(value);
                // console.log(JSON.parse(res));
              },
              (err: any) => {
                console.log('失败', err);
              }
            );
          }}
          title="扫描WIFI"
        />

        <Button
          onPress={async () => {
            WifiManager.disconnect();
          }}
          title="断开wifi"
        />
        <Button
          onPress={async () => {
            setShow(true);
          }}
          title="获取链接"
        />
      </View>

      <View style={styles.videoWrapper}>
        {show && (
          <VideoPlayer
            changeView={(value: string) => {
              setShow(false);
            }}
          />
        )}
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

export default WIFI;
