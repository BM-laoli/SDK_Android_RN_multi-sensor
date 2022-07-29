import React, { useState } from 'react';
import { useRef } from 'react';
import { Button, StyleSheet, Text, View } from 'react-native';
import { RNCamera } from 'react-native-camera';
import type { NextViewProps } from '../Modules/AudioVideoView';

const Camer: React.FC<NextViewProps> = (props) => {
  const { changeView } = props;
  const cameraRef = useRef<any>(null);
  const [isRecording, setIsRecording] = useState(false);

  // 实现录像
  const recordVideo = async () => {
    setIsRecording(true);
    const options = {
      quality: 0.5,
      path: `/storage/emulated/0/Download/skr/${new Date().getTime()}.mp4`,
    };

    // 直接存本地文件中去了 /storage/emulated/0/  为 Android 设备的实际路径
    const data = await cameraRef.current.recordAsync(options);
    console.log(data.uri);
  };

  // 结束录像
  const stopRecord = () => {
    cameraRef.current.stopRecording();
    setIsRecording(false);
  };

  return (
    <View style={styles.container}>
      <View style={styles.cameraWrap}>
        <RNCamera ref={cameraRef} style={styles.rnCamera} />
      </View>
      <View style={styles.controller}>
        <Text>{isRecording ? '正在录制' : '录制完成'}</Text>
      </View>
      <View style={styles.controller}>
        <Button onPress={recordVideo} title="开始录制" />
        <Button onPress={stopRecord} title="结束录制" />
        <Button onPress={() => changeView('list')} title="返回" />
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
  },
  cameraWrap: {
    width: '100%',
    height: '50%',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 80,
    backgroundColor: '#bae7ff',
  },
  rnCamera: {
    width: 400,
    height: 400,
  },
  controller: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 8,
    backgroundColor: '#bae7ff',
  },
});

export default Camer;
