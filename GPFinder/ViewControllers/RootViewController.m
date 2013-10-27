//
//  RootViewController.m
//  GP Ratings
//
//  Created by barrettmark.com on 25/10/2012.
//

#import "RootViewController.h"

@interface RootViewController ()

@end

@implementation RootViewController

/**
 * Always allow rotations but use the supportedInterfaceOrientations method to determine
 * which orientations are supported
 *
 */
- (BOOL)shouldAutorotate
{
    return YES;
}

/**
 * iOS6 only.
 *
 * replaces shouldAutorotateToInterfaceOrientation:
 */
- (NSUInteger)supportedInterfaceOrientations
{
    // A UIViewCongtroller should always respond to the selector supportedInterfaceOrientations
    if ([self.visibleViewController respondsToSelector:@selector(supportedInterfaceOrientations)]) {
        return [self.visibleViewController supportedInterfaceOrientations];        
    }
    
    return UIInterfaceOrientationMaskPortrait;
}

@end
