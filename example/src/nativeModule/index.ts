import { NativeModules } from 'react-native';

if (!NativeModules.RNNativeModule) {
  throw new Error('native模块加载失败');
}

// 加法
const multiply = async (a: number, b: number): Promise<Number> => {
  return NativeModules.RNNativeModule.multiply(a, b);
};

// 震动
const vibrator = async (): Promise<void> => {
  return NativeModules.RNNativeModule.vibrator();
};

// 创建路径
const createDir = async (filePath: string): Promise<string> => {
  return NativeModules.RNNativeModule.createDir(filePath);
};

// 返回路径下的文件list
// 震动
const getFilesAllName = async (filePath: string): Promise<Array<string>> => {
  return NativeModules.RNNativeModule.getFilesAllName(filePath);
};

const MySDK = {
  multiply,
  vibrator,
  createDir,
  getFilesAllName,
};

export default MySDK;
