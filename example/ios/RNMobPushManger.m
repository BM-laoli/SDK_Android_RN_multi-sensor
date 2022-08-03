//
//  RNMobPushManger.m
//  RnAndroidSenorExample
//
//  Created by wcmismac020 on 2022/8/2.
//

#import <Foundation/Foundation.h>
#import "RNMobPushManger.h"
#import <MOBFoundation/MobSDK+Privacy.h>
#import <MobPush/MobPush.h>

@implementation RNMobPushManger
{
  bool hasListeners;
}
// 只需要RCT 就好了 NativeModules.AwesomeModule 在js中就能生效
RCT_EXPORT_MODULE();

// OC 原生方法先写上
//   初始化
-(void)startReg {
    // 设置推送环境
   #ifdef DEBUG
       [MobPush setAPNsForProduction:NO];
   #else
       [MobPush setAPNsForProduction:YES];
   #endif
       //MobPush推送设置（获得角标、声音、弹框提醒权限）
       MPushNotificationConfiguration *configuration = [[MPushNotificationConfiguration alloc] init];
       configuration.types = MPushAuthorizationOptionsBadge | MPushAuthorizationOptionsSound | MPushAuthorizationOptionsAlert;
       [MobPush setupNotification:configuration];
    
    // 配置回掉
    //此方法需要在AppDelegate的 didFinishLaunchingWithOptions 方法里面注册 可参考Demo
    [[NSNotificationCenter defaultCenter] addObserver:self selector:@selector(didReceiveMessage:) name:MobPushDidReceiveMessageNotification object:nil];
};

//  注册事件监听
+(void)addObserverWithMobPush{
    [MobSDK uploadPrivacyPermissionStatus:YES onResult:^(BOOL success) {
      // 有时候是false 就是没有配置成功 这个YES or NO 需要交给用户来处理，目前我们暂时自己处理一下
      NSLog(@"配置成功！！！");
    }];
};

//  注册事件的处理函数（收到通知回调）
-(void)didReceiveMessage:(NSNotification *)notification{
    MPushMessage *message = notification.object;
    
        // 推送相关参数获取示例请在各场景回调中对参数进行处理
        NSString *messageID = message.messageID;// messageID
        NSString *taskID = @"null";
        NSString *title = message.notification.title;
        NSString *body = message.notification.body; //body
        NSDictionary *exObject = message.notification.userInfo; // exObject
    
        // 字典
        NSDictionary *dic1 = @{@"messageID":messageID, @"taskID":taskID, @"title":title,@"body":body,@"exObject":exObject};
        NSLog(@"获取的参数:{\nmessageObject:%@,}",dic1);

    switch (message.messageType)
    {
        case MPushMessageTypeCustom:
        {
            // 自定义消息回调
        }
            break;
        case MPushMessageTypeAPNs:
        {
            // APNs回调
        }
            break;
        case MPushMessageTypeLocal:
        {
            // 本地通知回调
            
        }
            break;
        case MPushMessageTypeClicked:
        {
            // 点击通知回调
            NSLog(@"你点击了通知");
          [self mobPushClickEventReminderReceived:dic1];
          // 放入队列
        }
        default:
            break;
    }
}



// 实现一个方法 初始化MobPush - RN
RCT_REMAP_METHOD(
                 initMobPush,
                 withResolver:(RCTPromiseResolveBlock)resolve
                 withRejecter:(RCTPromiseRejectBlock)reject)
{
  NSLog(@"点击我了点击我了");
  [self startReg];
  
  [RNMobPushManger addObserverWithMobPush];
  resolve(@"成功");
};


// 初始化监听和回掉 - RN
// 这个必须方法要重写
- (NSArray<NSString *> *)supportedEvents
{
  return @[@"EventReminder"];
}

// Will be called when this module's first listener is added.
-(void)startObserving {
    hasListeners = YES;
    // Set up any upstream listeners or background tasks as necessary
}

// Will be called when this module's last listener is removed, or on dealloc.
-(void)stopObserving {
    hasListeners = NO;
    // Remove upstream listeners, stop unnecessary background tasks
}

-(void)mobPushClickEventReminderReceived:(NSDictionary *)notification
{
//  NSString *eventName = notification.userInfo[@"name"];
  
//  if (hasListeners) { // Only send events if anyone is listening
    [self sendEventWithName:@"EventReminder" body:@{@"name": notification}];
//  }
}

@end
