//
//  AppDelegate.h
//  GPFInder
//
//  Created by barrettmark.com on 02/02/2012.
//

#import <UIKit/UIKit.h>

/**
 * Properties used to direct MagicalRecord to the datasotre
 *
 */
extern NSString * const DATASTORE_DIRECTORY;
extern NSString * const DATASTORE_FILENAME;

@interface AppDelegate : UIResponder <UIApplicationDelegate>

@property (strong, nonatomic) UIWindow *window;
@property (retain, nonatomic) UINavigationController *navigationController;

/**
 * Core Data properties
 */
@property (readonly, strong, nonatomic) NSManagedObjectContext *managedObjectContext;
@property (readonly, strong, nonatomic) NSManagedObjectModel *managedObjectModel;
@property (readonly, strong, nonatomic) NSPersistentStoreCoordinator *persistentStoreCoordinator;

/**
 * Copy the seed database out of the application bundle if no data is found in /caches/
 */
- (void)copySeedDataStoreIfNotFound;

/**
 * @returns string, absolute path to the datastore
 */
- (NSString *)dataStoreLocation;

/**
 * @returns string, absolute path to datastore with filename.
 */
- (NSString *)dataStoreFileLocation;

/**
 * @returns string, absolute path to seed datastore.
 */
- (NSString *)seedDataStoreFileLocation;

/**
 * @return bool true if database already exists in dataStoreFileLocation.
 */
- (BOOL)checkDataStoreFileExists;

/**
 * Copy the database out of application bundle to /caches/
 */
- (void)copyDataStoreToCaches;

/**
 * @returns string absolute path to application support.
 */
- (NSString *)applicationSupportDirectory;

@end
