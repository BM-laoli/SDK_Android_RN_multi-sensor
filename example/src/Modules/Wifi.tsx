import React, { useState } from 'react';
import { Button, Text, View, FlatList } from 'react-native';
import WifiManager from '../nativeModule/wifi';

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
              '88888888',
              true
            );
            console.log(value);
          } catch (error) {}
        }}
        title="链接"
      />
    </View>
  );
};

const WIFI = () => {
  const [data, setData] = useState([]);
  return (
    <View>
      <FlatList
        // @ts-ignore
        keyExtractor={(item, index) => String(index)}
        data={data}
        renderItem={Item}
      />
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
              setData(JSON.parse(res));
            },
            (err: any) => {
              console.log('失败', err);
            }
          );
        }}
        title="扫描WIFI"
      />
    </View>
  );
};

export default WIFI;
