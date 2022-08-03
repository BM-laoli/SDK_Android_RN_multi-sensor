//
//  MobPush.h
//  RnAndroidSenorExample
//
//  Created by wcmismac020 on 2022/8/2.
//
#import <Foundation/Foundation.h>

#import <React/RCTBridgeModule.h>

NS_ASSUME_NONNULL_BEGIN


@interface MobPushManger : NSObject <RCTBridgeModule>
{}
-(void)startReg;
-(void)didReceiveMessage:(NSNotification *)notification;
+(void)addObserverWithMobPush;
@end

NS_ASSUME_NONNULL_END
