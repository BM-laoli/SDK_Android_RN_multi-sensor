import { NativeModules, NativeEventEmitter } from 'react-native';

// @ts-ignore
import * as resolveAssetSourceCjsModule from 'react-native/Libraries/Image/resolveAssetSource';
const resolveAssetSource = resolveAssetSourceCjsModule.default;

if (!NativeModules.RNSound) {
  throw new Error('native模块加载失败');
}

const RNSound = NativeModules.RNSound;
const IsAndroid = RNSound.IsAndroid;
const IsWindows = RNSound.IsWindows;
let eventEmitter = new NativeEventEmitter(RNSound);

let nextKey = 0;
function isRelativePath(path: any) {
  return !/^(\/|http(s?)|asset|file)/.test(path);
}

function calculateRelativeVolume(volume: any, pan: any) {
  // calculates a lower volume relative to the pan value
  const relativeVolume = volume * (1 - Math.abs(pan));
  return Number(relativeVolume.toFixed(1));
}

function setAndroidVolumes(sound: any) {
  // calculates the volumes for left and right channels
  if (sound._pan) {
    const relativeVolume = calculateRelativeVolume(sound._volume, sound._pan);
    if (sound._pan < 0) {
      // left is louder
      RNSound.setVolume(sound._key, sound._volume, relativeVolume);
    } else {
      // right is louder
      RNSound.setVolume(sound._key, relativeVolume, sound._volume);
    }
  } else {
    // no panning, same volume on both channels
    RNSound.setVolume(sound._key, sound._volume, sound._volume);
  }
}

// @ts-ignore
function Sound(filename, basePath?: any, onError?: any, options?: any) {
  var asset = resolveAssetSource(filename);
  if (asset) {
    // @ts-ignore
    this._filename = asset.uri;
    onError = basePath;
  } else {
    // @ts-ignore
    this._filename = basePath ? basePath + '/' + filename : filename;

    if (IsAndroid && !basePath && isRelativePath(filename)) {
      // @ts-ignore
      this._filename = filename.toLowerCase().replace(/\.[^.]+$/, '');
    }
  }

  // @ts-ignore
  this.registerOnPlay = function () {
    if (this.onPlaySubscription != null) {
      console.warn('On Play change event listener is already registered');
      return;
    }

    if (!IsWindows) {
      this.onPlaySubscription = eventEmitter.addListener(
        'onPlayChange',
        (param) => {
          const { isPlaying, playerKey } = param;
          if (playerKey === this._key) {
            if (isPlaying) {
              this._playing = true;
            } else {
              this._playing = false;
            }
          }
        }
      );
    }
  };
  // @ts-ignore
  this._loaded = false;
  // @ts-ignore
  this._key = nextKey++;
  // @ts-ignore
  this._playing = false;
  // @ts-ignore
  this._duration = -1;
  // @ts-ignore
  this._numberOfChannels = -1;
  // @ts-ignore
  this._volume = 1;
  // @ts-ignore
  this._pan = 0;
  // @ts-ignore
  this._numberOfLoops = 0;
  // @ts-ignore
  this._speed = 1;
  // @ts-ignore
  this._pitch = 1;
  // @ts-ignore
  RNSound.prepare(this._filename, this._key, options || {}, (error, props) => {
    if (props) {
      if (typeof props.duration === 'number') {
        // @ts-ignore
        this._duration = props.duration;
      }
      if (typeof props.numberOfChannels === 'number') {
        // @ts-ignore
        this._numberOfChannels = props.numberOfChannels;
      }
    }
    if (error === null) {
      // @ts-ignore
      this._loaded = true;
      // @ts-ignore
      this.registerOnPlay();
    }
    onError && onError(error, props);
  });
}

Sound.prototype.isLoaded = function () {
  return this._loaded;
};

// @ts-ignore
Sound.prototype.play = function (onEnd) {
  if (this._loaded) {
    // @ts-ignore
    RNSound.play(this._key, (successfully) => onEnd && onEnd(successfully));
  } else {
    onEnd && onEnd(false);
  }
  return this;
};

// @ts-ignore
Sound.prototype.pause = function (callback) {
  if (this._loaded) {
    RNSound.pause(this._key, () => {
      this._playing = false;
      callback && callback();
    });
  }
  return this;
};

// @ts-ignore
Sound.prototype.stop = function (callback) {
  if (this._loaded) {
    RNSound.stop(this._key, () => {
      this._playing = false;
      callback && callback();
    });
  }
  return this;
};

Sound.prototype.reset = function () {
  if (this._loaded && IsAndroid) {
    RNSound.reset(this._key);
    this._playing = false;
  }
  return this;
};

Sound.prototype.release = function () {
  if (this._loaded) {
    RNSound.release(this._key);
    this._loaded = false;
    if (!IsWindows) {
      if (this.onPlaySubscription != null) {
        this.onPlaySubscription.remove();
        this.onPlaySubscription = null;
      }
    }
  }
  return this;
};

Sound.prototype.getFilename = function () {
  return this._filename;
};

Sound.prototype.getDuration = function () {
  return this._duration;
};

Sound.prototype.getNumberOfChannels = function () {
  return this._numberOfChannels;
};

Sound.prototype.getVolume = function () {
  return this._volume;
};

Sound.prototype.getSpeed = function () {
  return this._speed;
};

Sound.prototype.getPitch = function () {
  return this._pitch;
};

// @ts-ignore
Sound.prototype.setVolume = function (value) {
  this._volume = value;
  if (this._loaded) {
    if (IsAndroid) {
      setAndroidVolumes(this);
    } else {
      RNSound.setVolume(this._key, value);
    }
  }
  return this;
};

// @ts-ignore
Sound.prototype.setPan = function (value) {
  this._pan = value;
  if (this._loaded) {
    if (IsWindows) {
      throw new Error('#setPan not supported on windows');
    } else if (IsAndroid) {
      setAndroidVolumes(this);
    } else {
      RNSound.setPan(this._key, value);
    }
  }
  return this;
};

// @ts-ignore
Sound.prototype.getSystemVolume = function (callback) {
  if (!IsWindows) {
    RNSound.getSystemVolume(callback);
  }
  return this;
};
// @ts-ignore
Sound.prototype.setSystemVolume = function (value) {
  if (IsAndroid) {
    RNSound.setSystemVolume(value);
  }
  return this;
};

Sound.prototype.getPan = function () {
  return this._pan;
};

Sound.prototype.getNumberOfLoops = function () {
  return this._numberOfLoops;
};
// @ts-ignore
Sound.prototype.setNumberOfLoops = function (value) {
  this._numberOfLoops = value;
  if (this._loaded) {
    if (IsAndroid || IsWindows) {
      RNSound.setLooping(this._key, !!value);
    } else {
      RNSound.setNumberOfLoops(this._key, value);
    }
  }
  return this;
};
// @ts-ignore
Sound.prototype.setSpeed = function (value) {
  this._speed = value;
  if (this._loaded) {
    if (!IsWindows) {
      RNSound.setSpeed(this._key, value);
    }
  }
  return this;
};
// @ts-ignore
Sound.prototype.setPitch = function (value) {
  this._pitch = value;
  if (this._loaded) {
    if (IsAndroid) {
      RNSound.setPitch(this._key, value);
    }
  }
  return this;
};
// @ts-ignore
Sound.prototype.getCurrentTime = function (callback) {
  if (this._loaded) {
    RNSound.getCurrentTime(this._key, callback);
  }
};
// @ts-ignore
Sound.prototype.setCurrentTime = function (value) {
  if (this._loaded) {
    RNSound.setCurrentTime(this._key, value);
  }
  return this;
};
// @ts-ignore
// android only
Sound.prototype.setSpeakerphoneOn = function (value) {
  if (IsAndroid) {
    RNSound.setSpeakerphoneOn(this._key, value);
  }
};

// ios only

// This is deprecated.  Call the static one instead.
// @ts-ignore
Sound.prototype.setCategory = function (value) {
  Sound.setCategory(value, false);
};

Sound.prototype.isPlaying = function () {
  return this._playing;
};
// @ts-ignore
Sound.enable = function (enabled) {
  RNSound.enable(enabled);
};
// @ts-ignore
Sound.enableInSilenceMode = function (enabled) {
  if (!IsAndroid && !IsWindows) {
    RNSound.enableInSilenceMode(enabled);
  }
};
// @ts-ignore
Sound.setActive = function (value) {
  if (!IsAndroid && !IsWindows) {
    RNSound.setActive(value);
  }
};
// @ts-ignore
Sound.setCategory = function (value, mixWithOthers = false) {
  if (!IsWindows) {
    RNSound.setCategory(value, mixWithOthers);
  }
};
// @ts-ignore
Sound.setMode = function (value) {
  if (!IsAndroid && !IsWindows) {
    RNSound.setMode(value);
  }
};

// @ts-ignore
Sound.setSpeakerPhone = function (value) {
  if (!IsAndroid && !IsWindows) {
    RNSound.setSpeakerPhone(value);
  }
};

Sound.MAIN_BUNDLE = RNSound.MainBundlePath;
Sound.DOCUMENT = RNSound.NSDocumentDirectory;
Sound.LIBRARY = RNSound.NSLibraryDirectory;
Sound.CACHES = RNSound.NSCachesDirectory;

export default Sound;
