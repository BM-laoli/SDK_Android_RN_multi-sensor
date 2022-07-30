package com.example.reactnativernandroidsenor;
import androidx.annotation.NonNull;

  import com.facebook.react.ReactPackage;
  import com.facebook.react.bridge.NativeModule;
  import com.facebook.react.bridge.ReactApplicationContext;
  import com.facebook.react.uimanager.ViewManager;

  import java.util.ArrayList;
  import java.util.Collections;
  import java.util.List;

public class RNNativeModulePackge implements ReactPackage {
  @NonNull
  @Override
  public List<NativeModule> createNativeModules(@NonNull ReactApplicationContext reactContext) {
    List<NativeModule> modules = new ArrayList<>();
    modules.add(new RNNativeModule(reactContext));
    modules.add(new AudioRecorderManager(reactContext));
    modules.add(new RNSoundModule(reactContext));
    modules.add(new RNWifiModule(reactContext));
    modules.add(new RNMobPushModule(reactContext));
    return modules;
  }

  @NonNull
  @Override
  public List<ViewManager> createViewManagers(@NonNull ReactApplicationContext reactContext) {
    return Collections.emptyList();
  }
}

