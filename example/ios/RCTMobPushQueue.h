//
//  RCTMobPushQueue.h
//  RnAndroidSenorExample
//
//  Created by wcmismac020 on 2022/8/3.
//

#import <Foundation/Foundation.h>

NS_ASSUME_NONNULL_BEGIN

@interface RCTMobPushQueue : NSObject

+ (nonnull instancetype) sharedInstance;

@property NSMutableArray<NSDictionary *> * _Nullable _notificationQueue;
@property NSMutableArray<NSDictionary *> * _Nullable _localNotificationQueue;

@end

NS_ASSUME_NONNULL_END
