//
//  FindGPsViewController.h
//  GPFinder
//
//  Created by barrettmark.com on 05/03/2012.
//

#import <UIKit/UIKit.h>

#import "MapSwitcherViewController.h"

@interface FindGPsViewController : UIViewController <UITextFieldDelegate>

@property (retain, nonatomic) IBOutlet UITextField *postcode;

/**
 * Load map switcher view depending on which button the user pressed and how much we know about
 * their location
 */
- (void)loadMapSwitcherViewController;

/**
 * User has opted for the app to find their location
 *  
 *  @param placemark string
 */
- (void)loadMapSwitcherViewControllerWithPlacemark:(CLPlacemark *)placemark;

/**
 *  User has provided a postcode string. We'll perform the lookup using Google maps API
 *  
 *  @param postcode string
 */
- (void)loadMapSwitcherViewControllerWithPostcode:(NSString *)postcode;

/**
 *  A convience method to perform the setup of the MapSwitcherViewController using the provded params
 *  
 *  @param mapSwitcherViewController
 */
- (void)loadMapSwitcherViewController:(MapSwitcherViewController *)mapSwitcherViewController;

/**
 * A check for a valid UK postcode string
 */
- (BOOL)isValidPostcode:(NSString *)postcode;

/**
 * Remove all the weird formatting people may add to their postcode
 */
- (NSString *)normalisedPostcodeText;

/**
 * Actions called on user interaction
 */
- (IBAction)currentLocationButtonPressed:(id)sender;
- (IBAction)postcodeSubmitButtonPressed:(id)sender;
- (IBAction)aboutButtonPressed:(id)sender;

@end
