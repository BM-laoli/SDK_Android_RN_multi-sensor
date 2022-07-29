/* eslint-disable react-native/no-inline-styles */
import React, { useEffect } from 'react';
import { useState } from 'react';
import { View, StyleSheet, Button, Text, FlatList } from 'react-native';
import MySDK from '../nativeModule';
const { getFilesAllName } = MySDK;
import Audio from '../Components/Audio';
import Camer from '../Components/Camer';
import AudioPlayer from '../Components/AudioPlayer';
import VideoPlayer from '../Components/VideoPlayer';

export interface NextViewProps {
  changeView: (value: TypeChangeView) => void;
  path?: string;
}
type TypeChangeView =
  | 'list'
  | 'audio'
  | 'camer'
  | 'palyerAudio'
  | 'palyerVideo';

interface InterData {
  id: string;
  fileName: string;
  timeLog: string;
  path: string;
}

const AudioVideoView = () => {
  const [viewCurrent, setViewCurrent] = useState<string>('list');
  const [data, setData] = useState<Array<InterData>>([]);
  const [path, setPath] = useState<string>('');

  // 读取数据
  const readFile = async () => {
    // 读取文件
    const value = await getFilesAllName('/storage/emulated/0/Download/skr');

    const dataRes = value.map((item) => {
      return {
        fileName: item.split('/')[item.split('/').length - 1],
        timeLog: '123',
        path: item,
        id: item,
      };
    });
    setData(dataRes);
  };
  useEffect(() => {
    readFile();
  }, []);
  // 刷新数据
  const realodData = () => {
    readFile();
  };

  const Item = (itemProps: { item: InterData }) => {
    const { item } = itemProps;

    return (
      <View style={styleAudio.item} key={item.id}>
        <View style={styleAudio.logoWrap}>
          <View style={styleAudio.logo} />
          <View style={styleAudio.message}>
            <Text>{item.fileName}</Text>
            <Text>时长: {item.timeLog}</Text>
          </View>
        </View>

        <View style={styleAudio.player}>
          <Button
            onPress={() => {
              if (item.fileName.includes('mp3')) {
                changeView('palyerAudio', item.path);
                return;
              }

              changeView('palyerVideo', item.path);
            }}
            title="播放"
          />
        </View>
      </View>
    );
  };

  const changeView = (value: TypeChangeView, path?: string) => {
    setViewCurrent(value);
    if (value === 'palyerAudio' || value === 'palyerVideo') {
      setPath(path || '');
    }
  };

  return (
    <View style={styleAudio.container}>
      {viewCurrent === 'list' && (
        <>
          {/* 录制 */}
          <View style={styleAudio.controllerTitle}>
            <View style={styleAudio.recordAudio}>
              <Button onPress={() => changeView('audio')} title="录制音频" />
            </View>
            <View style={styleAudio.recordVideo}>
              <Button onPress={realodData} title="刷新数据" />
            </View>
            <View style={styleAudio.recordVideo}>
              <Button onPress={() => changeView('camer')} title="录制视频" />
            </View>
          </View>
          {/* 音频视频列表 */}
          <View style={styleAudio.listContainer}>
            <FlatList
              keyExtractor={(item) => item.id}
              data={data}
              renderItem={Item}
            />
          </View>
        </>
      )}
      {/* 容器 */}
      {viewCurrent === 'audio' && <Audio changeView={changeView} />}
      {viewCurrent === 'camer' && <Camer changeView={changeView} />}
      {viewCurrent === 'palyerAudio' && (
        <AudioPlayer changeView={changeView} path={path} />
      )}
      {viewCurrent === 'palyerVideo' && (
        <VideoPlayer changeView={changeView} path={path} />
      )}
    </View>
  );
};

const styleAudio = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    padding: 20,
    backgroundColor: '#ffffff',
  },
  controllerTitle: {
    flexDirection: 'row',
    width: '100%',
    backgroundColor: '#e6f7ff',
    padding: 8,
    justifyContent: 'space-between',
  },
  recordAudio: {},
  recordVideo: {},
  listContainer: {
    width: '100%',
    flex: 1,
    padding: 8,
    backgroundColor: '#e6f7ff',
    marginTop: 12,
  },
  item: {
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'space-between',
    padding: 12,
    backgroundColor: '#fff',
    marginBottom: 12,
  },
  logoWrap: {
    flexDirection: 'row',
    width: '50%',
  },
  logo: {
    width: 50,
    height: 50,
    backgroundColor: '#bae7ff',
  },
  message: {
    marginLeft: 12,
    justifyContent: 'space-between',
  },
  player: {},
});

export default AudioVideoView;
