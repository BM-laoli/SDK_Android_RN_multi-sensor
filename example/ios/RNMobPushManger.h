//
//  RNMobPushManger.h
//  RnAndroidSenorExample
//
//  Created by wcmismac020 on 2022/8/2.
//

#import <Foundation/Foundation.h>

#import <React/RCTBridgeModule.h>
#import <React/RCTEventEmitter.h>
#import <React/RCTBridgeDelegate.h>

NS_ASSUME_NONNULL_BEGIN

@interface RNMobPushManger : RCTEventEmitter<RCTBridgeDelegate>
{}
-(void)startReg;
-(void)didReceiveMessage:(NSNotification *)notification;
+(void)addObserverWithMobPush;
@end

NS_ASSUME_NONNULL_END
