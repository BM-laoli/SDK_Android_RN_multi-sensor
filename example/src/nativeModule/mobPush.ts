import { NativeModules } from 'react-native';

if (!NativeModules.RNMobPushModule) {
  throw new Error(' PUSH模块加载失败  ');
}

const initPush = () => {
  return NativeModules.RNMobPushModule.initMobPush();
};

// 关于监听 我们交给使用它的第三方

export default NativeModules.RNMobPushModule;

export { initPush };
