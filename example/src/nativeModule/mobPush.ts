import { NativeModules, Platform } from 'react-native';

let RNMobPushModule = {} as any;

if (Platform.OS === 'android') {
  if (!NativeModules.RNMobPushModule) {
    throw new Error(' PUSH模块加载失败  ');
  }
  RNMobPushModule = NativeModules.RNMobPushModule;
} else if (Platform.OS === 'ios') {
  if (!NativeModules?.RNMobPushManger) {
    throw new Error(' PUSH模块加载失败  ');
  }
  RNMobPushModule = NativeModules.RNMobPushManger;
}
const initPush = () => {
  return RNMobPushModule?.initMobPush();
};

// 关于监听 我们交给使用它的第三方

export default RNMobPushModule;

export { initPush };
