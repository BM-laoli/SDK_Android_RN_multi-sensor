import {
  NativeModules,
  NativeAppEventEmitter,
  PermissionsAndroid,
  Platform,
} from 'react-native';

var AudioRecorderManager = NativeModules.AudioRecorderManager;

var AudioRecorder = {
  prepareRecordingAtPath: function (path: any, options: any) {
    // @ts-ignore
    if (this.progressSubscription) this.progressSubscription.remove();
    // @ts-ignore
    this.progressSubscription = NativeAppEventEmitter.addListener(
      'recordingProgress',
      (data) => {
        // @ts-ignore
        if (this.onProgress) {
          // @ts-ignore
          this.onProgress(data);
        }
      }
    );
    // @ts-ignore
    if (this.finishedSubscription) this.finishedSubscription.remove();
    // @ts-ignore
    this.finishedSubscription = NativeAppEventEmitter.addListener(
      'recordingFinished',
      (data) => {
        // @ts-ignore
        if (this.onFinished) {
          // @ts-ignore
          this.onFinished(data);
        }
      }
    );

    var defaultOptions = {
      SampleRate: 44100.0,
      Channels: 2,
      AudioQuality: 'High',
      AudioEncoding: 'ima4',
      OutputFormat: 'mpeg_4',
      MeteringEnabled: false,
      MeasurementMode: false,
      AudioEncodingBitRate: 32000,
      IncludeBase64: false,
      AudioSource: 0,
    };

    var recordingOptions = { ...defaultOptions, ...options };

    if (Platform.OS === 'ios') {
      AudioRecorderManager.prepareRecordingAtPath(
        path,
        recordingOptions.SampleRate,
        recordingOptions.Channels,
        recordingOptions.AudioQuality,
        recordingOptions.AudioEncoding,
        recordingOptions.MeteringEnabled,
        recordingOptions.MeasurementMode,
        recordingOptions.IncludeBase64
      );
    } else {
      return AudioRecorderManager.prepareRecordingAtPath(
        path,
        recordingOptions
      );
    }
  },
  startRecording: function () {
    return AudioRecorderManager.startRecording();
  },
  pauseRecording: function () {
    return AudioRecorderManager.pauseRecording();
  },
  resumeRecording: function () {
    return AudioRecorderManager.resumeRecording();
  },
  stopRecording: function () {
    return AudioRecorderManager.stopRecording();
  },
  checkAuthorizationStatus: AudioRecorderManager.checkAuthorizationStatus,
  requestAuthorization: () => {
    if (Platform.OS === 'ios')
      return AudioRecorderManager.requestAuthorization();
    else
      return new Promise((resolve) => {
        PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.RECORD_AUDIO
        ).then((result) => {
          // @ts-ignore
          if (result == PermissionsAndroid.RESULTS.GRANTED || result == true)
            resolve(true);
          else resolve(false);
        });
      });
  },
  removeListeners: function () {
    // @ts-ignore
    if (this.progressSubscription) this.progressSubscription.remove();
    // @ts-ignore
    if (this.finishedSubscription) this.finishedSubscription.remove();
  },
};

let AudioUtils = {};
let AudioSource = {};

if (Platform.OS === 'ios') {
  AudioUtils = {
    MainBundlePath: AudioRecorderManager.MainBundlePath,
    CachesDirectoryPath: AudioRecorderManager.NSCachesDirectoryPath,
    DocumentDirectoryPath: AudioRecorderManager.NSDocumentDirectoryPath,
    LibraryDirectoryPath: AudioRecorderManager.NSLibraryDirectoryPath,
  };
} else if (Platform.OS === 'android') {
  AudioUtils = {
    MainBundlePath: AudioRecorderManager.MainBundlePath,
    CachesDirectoryPath: AudioRecorderManager.CachesDirectoryPath,
    DocumentDirectoryPath: AudioRecorderManager.DocumentDirectoryPath,
    LibraryDirectoryPath: AudioRecorderManager.LibraryDirectoryPath,
    PicturesDirectoryPath: AudioRecorderManager.PicturesDirectoryPath,
    MusicDirectoryPath: AudioRecorderManager.MusicDirectoryPath,
    DownloadsDirectoryPath: AudioRecorderManager.DownloadsDirectoryPath,
  };
  AudioSource = {
    DEFAULT: 0,
    MIC: 1,
    VOICE_UPLINK: 2,
    VOICE_DOWNLINK: 3,
    VOICE_CALL: 4,
    CAMCORDER: 5,
    VOICE_RECOGNITION: 6,
    VOICE_COMMUNICATION: 7,
    REMOTE_SUBMIX: 8, // added in API 19
    UNPROCESSED: 9, // added in API 24
  };
}
const AudioRecorderManagerObject = {
  AudioRecorder,
  AudioUtils,
  AudioSource,
};

export default AudioRecorderManagerObject;
