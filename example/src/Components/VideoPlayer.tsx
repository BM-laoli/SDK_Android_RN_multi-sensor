/* eslint-disable react-native/no-inline-styles */
import React, { useRef, useState } from 'react';
import { View, Button, StyleSheet } from 'react-native';
import type { NextViewProps } from '../Modules/AudioVideoView';

// @ts-ignore
import Video from 'react-native-video';

const VideoPlayer: React.FC<NextViewProps> = (props) => {
  const { changeView, path } = props;
  const videoRef = useRef<any>(null);
  const [videoControl, setVideoControl] = useState({
    paused: true, // 暂停
  });

  // 随机播放 Innter 上的地址
  const playerVideo = () => {
    // console.log(2333);
    setVideoControl({ paused: false });
  };

  // 缓存监听
  const onBuffer = () => {};

  // 错误监听
  const videoError = () => {};
  return (
    <View style={styles.container}>
      <View
        style={{
          width: 300,
          height: 300,
        }}
      >
        <Video
          {...videoControl}
          source={{
            // uri: path,
            uri: 'http://vfx.mtime.cn/Video/2019/03/19/mp4/190319212559089721.mp4',
            // uri: '/storage/emulated/0/Download/1658997906279.mp4',
          }} // Can be a URL or a local file.
          onBuffer={onBuffer} // Callback when remote video is buffering
          onError={videoError}
          ref={videoRef}
          style={styles.videoWrapper}
        />
      </View>
      <View style={styles.controller}>
        <Button onPress={playerVideo} title="播放" />
        <Button
          onPress={() => {
            setVideoControl({ paused: true });
          }}
          title="暂停"
        />
        <Button
          onPress={() => {
            changeView('list');
          }}
          title="返回"
        />
      </View>
    </View>
  );
};

export default VideoPlayer;
const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
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
    backgroundColor: '#bae7ff',
  },
});
