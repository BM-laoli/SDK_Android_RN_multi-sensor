package com.example.reactnativernandroidsenor;

import android.content.Context;
import android.util.Log;

import androidx.annotation.NonNull;
import androidx.annotation.Nullable;

import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.module.annotations.ReactModule;
import com.facebook.react.modules.core.DeviceEventManagerModule;
import com.mob.MobSDK;
import com.mob.pushsdk.MobPush;
import com.mob.pushsdk.MobPushCustomMessage;
import com.mob.pushsdk.MobPushNotifyMessage;
import com.mob.pushsdk.MobPushReceiver;

import org.json.JSONObject;

import java.util.HashMap;

@ReactModule(name = RNMobPushModule.NAME)
public class RNMobPushModule extends ReactContextBaseJavaModule {
  public static final String NAME = "RNMobPushModule";
  MobPushReceiver mobpushReceiver;

  public RNMobPushModule(ReactApplicationContext reactContext) {
    super(reactContext);
  }

  @Override
  @NonNull
  public String getName() {
    return NAME;
  }

  /**
   * 关于如何发送消息给RN 的做法如下
   */
  private void sendEvent(ReactContext reactContext, String eventName, @Nullable WritableMap params) {
    reactContext
      .getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class)
      .emit(eventName, params);
  }

  @ReactMethod
  public void addListener(String eventName) {
    // Set up any upstream listeners or background tasks as necessary
  }

  @ReactMethod
  public void removeListeners(Integer count) {
    // Remove upstream listeners, stop unnecessary background tasks
  }

  /**
   * 初始化PUSH
   */
  @ReactMethod
  public void initMobPush(Promise promise){
    promise.resolve("成功！");
    System.out.println("启动");
    MobSDK.submitPolicyGrantResult(true);
    System.out.println("配置完成");

    // 配置回掉 发消息给RN
    mobpushReceiver = new MobPushReceiver() {
      @Override
      public void onCustomMessageReceive(Context context, MobPushCustomMessage mobPushCustomMessage) { }

      @Override
      public void onNotifyMessageReceive(Context context, MobPushNotifyMessage mobPushNotifyMessage) {
        //接收到通知消息
        String Id = mobPushNotifyMessage.getMobNotifyId();//获取消息ID
        String TaskId = mobPushNotifyMessage.getMessageId();//获取任务ID
        String Title = mobPushNotifyMessage.getTitle();//获取推送标题
        String Content =  mobPushNotifyMessage.getContent();//获取推送内容

        // 获取定制内容
        HashMap exMap = mobPushNotifyMessage.getExtrasMap();
        JSONObject jsonObj = new JSONObject(exMap);//转化为json格式

        // 创建JS 对象 发给RN
        WritableMap params = Arguments.createMap();
        params.putString("Id", Id);
        params.putString("TaskId", TaskId);
        params.putString("Title", Title);
        params.putString("Content", Content);
        params.putString("exObject", jsonObj.toString()); // 注意这是一个JSONString
        sendEvent(getReactApplicationContext(), "EventReminder", params);
      }

      @Override
      public void onNotifyMessageOpenedReceive(Context context, MobPushNotifyMessage mobPushNotifyMessage) {
        //通知被点击事件
        String Id = mobPushNotifyMessage.getMobNotifyId();//获取消息ID
        String TaskId = mobPushNotifyMessage.getMessageId();//获取任务ID
        String Title = mobPushNotifyMessage.getTitle();//获取推送标题
        String Content =  mobPushNotifyMessage.getContent();//获取推送内容

        // 获取定制内容
        HashMap exMap = mobPushNotifyMessage.getExtrasMap();
        JSONObject jsonObj = new JSONObject(exMap);//转化为json格式

        // 创建JS 对象 发给RN
        WritableMap params = Arguments.createMap();
        params.putString("Id", Id);
        params.putString("TaskId", TaskId);
        params.putString("Title", Title);
        params.putString("Content", Content);
        params.putString("exObject", jsonObj.toString()); // 注意这是一个JSONString
        sendEvent(getReactApplicationContext(), "EventReminder", params);
      }

      @Override
      public void onTagsCallback(Context context, String[] strings, int i, int i1) { }

      @Override
      public void onAliasCallback(Context context, String s, int i, int i1) { }
    };

    MobPush.addPushReceiver(mobpushReceiver);
  }

  /**
   * 当PUSH 信息触达
   */
  @ReactMethod
  public void onNotifyMessageReceiveRN(Promise promise){
    promise.resolve("成功！");
  }


  /**
   * 当PUSH 信息被点击
   */
  @ReactMethod
  public void onNotifyMessageOpenedReceiveRN(Promise promise){
    promise.resolve("成功！");
  }



}
