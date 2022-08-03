//
//  RCTMobPushQueue.m
//  RnAndroidSenorExample
//
//  Created by wcmismac020 on 2022/8/3.
//

#import "RCTMobPushQueue.h"

@implementation RCTMobPushQueue

+ (instancetype)sharedInstance {
    static RCTMobPushQueue *instance = nil;
    static dispatch_once_t onceToken;
    dispatch_once(&onceToken, ^{
        instance = [[self alloc] init];
    });
    return instance;
}

- (instancetype)init
{
    self = [super init];
    if (self) {
        self._notificationQueue = [NSMutableArray new];
        self._localNotificationQueue = [NSMutableArray new];
    }
    return self;
}

@end
