//
//  MapSwitcherViewController.h
//  GPFinder
//
//  Created by barrettmark.com on 05/03/2012.
//

#import <UIKit/UIKit.h>

#import "GPsTableViewController.h"
#import "MapViewController.h"
#import "MBProgressHUD.h"

 /**
  *  This class is responsible for switching between two view controllers depending on 
  * the devices orientation.
  *
  * Unfortunately, this class isn't quite generic enough to be reusable, there's quite a lot of glue
  * code to pass the state between the two contorllers.
  */

@interface MapSwitcherViewController : UIViewController <CLLocationManagerDelegate>

/**
 *  View controller to switch to when in portrait
 */
@property (retain, nonatomic) GPsTableViewController *portraitViewController;

/**
 *  View controller to switch to when in landscape
 */
@property (retain, nonatomic) MapViewController *landscapeViewController;

/**
 * Property to define the currently loaded child view controller.
 *
 * Used when [self switchView] is called to determine whether we need to switch views or not
 *
 * @see switchView
 */
@property (retain, nonatomic) UIViewController *currentChildViewController;

/**
 * Current location. Returned by the CLLocationManagerDelegate
 */
@property (retain, nonatomic) CLLocation *location;

/**
 * The postcode the user wishes to search by. Used by this class to fetch a location.
 */
@property (retain, nonatomic) NSString *postcode;

/**
 * GPs, a list of GPs sorted by how close they are to current location.
 */
@property (retain, nonatomic) NSArray *gps;

/**
 * Used by CLLocationManagerDelegate to fetch the current location
 */
@property (retain, nonatomic) CLLocationManager *locationManager;

/**
 * Overlay for userfeedback
 */
@property (retain, nonatomic) MBProgressHUD *hud;

/**
 * If we have a location, fetch GPs based on distant, else fetch location from postcode data
 */
- (void)populateControllersOrFindCurrentLocation;

/**
 * Using the passed postcode, fetch a Location object.
 */
- (void)findCurrentLocation;

/**
 * Populate this and both the portrait and landscape view controllers with GP data
 */
- (void)populateControllersWithGPData;

/**
 * Used to display MBProgressHUD with approprate message
 */ 
- (void)showLoaderWithText:(NSString *)text;

/**
 * Send postcode data to GEOCoder
 */
- (void)getLocationFromPostcode:(NSString *)postcode withCompletionHandler:(void (^)(NSArray *placemarks, NSError *error)) block;

/**
 * Register our interest in keeping updated with current location
 */
- (void)listenForOrientationChangeNotifications;

/**
 * Let delegate know that we are no longer interested in location upates
 */
- (void)stopListeningForOrientationChangeNotification;

/**
 * Push portrait view onto stack
 *
 * @see transitionFromViewController:
 */
- (void)loadPortraitView;

/**
 * Push landscape view onto stack
 *
 * @see transitionFromViewController:
 */
- (void)loadLandscapeView;

/**
 * if portrait view is loaded, switch to landscape and vice-versa
 */
- (void)switchView;

/**
 * Check whether current orientation is portrait
 */
- (BOOL)isOrientationPortrait;

/**
 * Check whether current orientation is landscape
 */
- (BOOL)isOrientationLandscape;

/**
 * Check whether current view is landscape
 */
- (BOOL)isLandscapeViewControllerLoaded;

/**
 * Check whether current view is portrait
 */
- (BOOL)isPortraitViewControllerLoaded;

/**
 * Callback called when oriation is changed
 */
- (void)orientationChanged:(id)sender;

@end
