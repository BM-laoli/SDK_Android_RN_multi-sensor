import React, { useEffect, useRef } from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';
import type { NextViewProps } from '../Modules/AudioVideoView';
import Sound from '../nativeModule/sound';

const name = '3.mp3';

const AudioPlayer: React.FC<NextViewProps> = (props) => {
  const { changeView, path } = props;
  const soundRef = useRef<any>(null);
  useEffect(() => {
    Sound.setCategory('Playback');
    // @ts-ignore
    soundRef.current = new Sound(path, Sound.MAIN_BUNDLE, (error: any) => {
      if (error) {
        console.log('failed to load the sound', error);
      }
      return;
    });
  }, [path]);

  return (
    <View style={styles.container}>
      <Text>当前正在播放: {name}</Text>
      <View style={styles.controller}>
        <Button
          onPress={() => {
            soundRef.current.play((success: boolean) => {
              if (success) {
                console.log('successfully finished playing');
              } else {
                console.log('playback failed due to audio decoding errors');
              }
            });
          }}
          title="播放"
        />
        <Button
          onPress={() => {
            soundRef.current.pause();
          }}
          title="暂停"
        />
        <Button
          onPress={() => {
            soundRef.current.release();
            changeView('list');
          }}
          title="返回"
        />
      </View>
      <View />
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

  controller: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 8,
    backgroundColor: '#bae7ff',
  },
});

export default AudioPlayer;
