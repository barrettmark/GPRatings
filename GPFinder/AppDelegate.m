//
//  AppDelegate.m
//  GPFInder
//
//  Created by barrettmark.com on 02/02/2012.
//

#import "AppDelegate.h"

#import "GP+methods.h"

#import "FindGPsViewController.h"
#import "RootViewController.h"

NSString * const DATASTORE_DIRECTORY = @"/Caches/";
NSString * const DATASTORE_FILENAME = @"GPRatings.v1.2.sqlite";

@implementation AppDelegate

/**
 *  Set up libraries, copy core data file over to bundle and load up the initial view controllers
 *  
 *  @param application
 *  @param launchOptions
 *  
 *  @return BOOL
 */
- (BOOL)application:(UIApplication *)application didFinishLaunchingWithOptions:(NSDictionary *)launchOptions {

	[self copyDataStoreToCaches];

    [MagicalRecord setupCoreDataStackWithStoreNamed:[NSURL fileURLWithPath:self.dataStoreFileLocation isDirectory:NO]];
           
    [[UIApplication sharedApplication] setStatusBarStyle:UIStatusBarStyleBlackOpaque animated:NO];
    self.window = [[UIWindow alloc] initWithFrame:[[UIScreen mainScreen] bounds]];

    FindGPsViewController *findGPsViewController = [[FindGPsViewController alloc] initWithNibName:@"FindGPsView" bundle:nil];
    self.navigationController = [[RootViewController alloc] initWithRootViewController:findGPsViewController];
    [[self.navigationController navigationBar] setTintColor:[UIColor blackColor]];
    [self.window setRootViewController:self.navigationController];
    
    [self.window setBackgroundColor:[UIColor whiteColor]];
    [self.window makeKeyAndVisible];
    
    return YES;
}

- (void)applicationWillEnterForeground:(UIApplication *)application {
    [self copyDataStoreToCaches];
}

- (void)copySeedDataStoreIfNotFound {
    if (![self checkDataStoreFileExists]) {
        // Copy to application support GPFinder
        [self copyDataStoreToCaches];
    }
}

- (NSString *)dataStoreLocation {  
    return [self cachesDirectory];
}

- (NSString *)dataStoreFileLocation {
    NSString *documentStoreLocation = [self dataStoreLocation];
    return [documentStoreLocation stringByAppendingPathComponent:DATASTORE_FILENAME];
}

- (NSString *)seedDataStoreFileLocation {
	return [[NSBundle mainBundle] pathForResource:@"GPFinder.v1.2" ofType:@"sqlite"];
}

- (BOOL)checkDataStoreFileExists {
    return [[NSFileManager defaultManager] fileExistsAtPath:[self dataStoreFileLocation]];
}

- (void)copyDataStoreToCaches {
    
    NSString *documentStoreFileLocation = [self dataStoreFileLocation];
    NSString *seedDataStoreFileLocation = [self seedDataStoreFileLocation];
    
    NSError *error = nil;
    
    NSFileManager *fileManager = [NSFileManager defaultManager];
    
    if (![fileManager fileExistsAtPath:seedDataStoreFileLocation]) {
        NSLog(@"File doesn't exists at: %@", seedDataStoreFileLocation);
    }
    
    if (![fileManager fileExistsAtPath:[self dataStoreLocation]]) {
        [fileManager createDirectoryAtPath:[self dataStoreLocation] withIntermediateDirectories:YES attributes:nil error:&error];
        if (error) {
            NSLog(@"Directory cannot be created at: %@", [self dataStoreLocation]);
        }
    }
    
    if (![fileManager fileExistsAtPath:documentStoreFileLocation]) {
        [fileManager copyItemAtPath:seedDataStoreFileLocation toPath:documentStoreFileLocation error:&error]; 
        if (error) {
            NSLog(@"Copy failed with error: %@", [error localizedDescription]);
        }
    }
}

- (NSString *)applicationSupportDirectory {
	NSArray *paths = NSSearchPathForDirectoriesInDomains(NSApplicationSupportDirectory, NSUserDomainMask, YES);
	return [paths objectAtIndex:0];
}

- (NSString *)cachesDirectory {
	NSArray *paths = NSSearchPathForDirectoriesInDomains(NSCachesDirectory, NSUserDomainMask, YES);
	return [paths objectAtIndex:0];
}

@end
