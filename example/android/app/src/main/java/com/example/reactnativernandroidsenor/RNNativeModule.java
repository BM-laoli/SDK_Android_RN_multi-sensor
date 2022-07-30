package com.example.reactnativernandroidsenor;


import android.content.Context;
import android.os.Vibrator;
import android.util.Log;

import androidx.annotation.NonNull;

import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.ReadableArray;
import com.facebook.react.bridge.WritableArray;
import com.facebook.react.module.annotations.ReactModule;

import java.io.File;
import java.io.IOException;
import java.util.ArrayList;
import java.util.List;

@ReactModule(name = RNNativeModule.NAME)
class RNNativeModule extends ReactContextBaseJavaModule {
  public static final String NAME = "RNNativeModule";
  public static final String FLAG_SUCCESS = "Success!";
  public static final String FLAG_FAILED = "Error!";

  public RNNativeModule(ReactApplicationContext reactContext) {
    super(reactContext);
  }

  @Override
  @NonNull
  public String getName() {
    return NAME;
  }

  @ReactMethod
  public void multiply(int a, int b, Promise promise) {
    promise.resolve(a * b);
  }

  /**
   * 创建路径和文件夹
   */
  @ReactMethod
  public void createDir(String filePath , Promise promise) {
    File file = new File(filePath);

    if (file.exists()) {
      promise.reject("文件夹已经存在！");
    }
    if (filePath.endsWith(File.separator)) {// 以 路径分隔符 结束，说明是文件夹
      promise.reject("The file [ \" + filePath + \" ] can not be a directory");
    }

    //判断父目录是否存在
    if (!file.getParentFile().exists()) {
      //父目录不存在 创建父目录
      if (!file.mkdirs()) {
        promise.resolve("创建成功");
      }
      promise.reject("创建文件夹失败");
    }

    promise.reject("文件夹已经存在！");
  }


  /**
   * 读取路径下的所有文件返回其路径名
   */
  @ReactMethod
  public void getFilesAllName(String path, Promise promise) {
    File file = new File(path);
    File[] files = file.listFiles();

    if (files == null){
      promise.reject("空目录");
      return;
    }


    WritableArray list = Arguments.createArray();
    for(int i =0; i<files.length;i++){
      list.pushString(files[i].getAbsolutePath());
    }
    System.out.println(list);
    promise.resolve(list);
  }

  /**
   * 震动
   */
  @ReactMethod
  public void vibrator(){
   Vibrator vibrator = (Vibrator) getReactApplicationContext().getSystemService(Context.VIBRATOR_SERVICE);
   vibrator.vibrate(1000);
  }
}
