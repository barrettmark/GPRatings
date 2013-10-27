//
//  GPDetailViewController.h
//  GPFInder
//
//  Created by barrettmark.com on 20/02/2012.
//

#import <UIKit/UIKit.h>

#import "GP+methods.h"
#import "GPDisplayStrings.h"

 /**
  *  This class displays information about a specific GP
  */

@interface GPDetailViewController : UIViewController <UITableViewDelegate, UITableViewDataSource>

@property (retain, nonatomic) IBOutlet UITableView *tableView;

/**
 *  Labels for UIView fields
 */
@property (retain, nonatomic) IBOutlet UILabel *nameLabel;
@property (retain, nonatomic) IBOutlet UILabel *addressLabel;
@property (retain, nonatomic) IBOutlet UIImageView *ratingImageView;
@property (retain, nonatomic) IBOutlet UIButton *phoneButton;
@property (retain, nonatomic) IBOutlet UITableViewCell *gpTableViewCell;
@property (retain, nonatomic) IBOutlet UILabel *maleGPsLabel;
@property (retain, nonatomic) IBOutlet UILabel *femaleGPsLabel;
@property (retain, nonatomic) IBOutlet UILabel *distanceLabel;

/**
 *  Users location or queried location to display on map for directions
 */
@property (retain, nonatomic) CLLocation *location;

/**
 *  GP to view
 */
@property (retain, nonatomic) GP *gp;

/**
 *  Order for GP properties
 */
@property (retain, nonatomic) NSDictionary *viewOrder;

/**
 *  GP properties to display
 */
@property (retain, nonatomic) NSArray *keys;

/**
 *  Nicer, more readable list of GP properties
 */
@property (retain, nonatomic) GPDisplayStrings *gpDetailStrings;

/**
 * Get value from GP model for a given key. Cast value to string
 */
- (NSString *)textForKey:(NSString *)key;

/**
 * Using the keys property figure out which row data to display
 */
- (NSString *)keyForIndexPath:(NSIndexPath *)indexPath;

/**
 * Make phone call
 */
- (void)makeCall:(NSString *)phoneNumber;

/**
 * Methods called when user taps appropriate row
 *
 * @see didSelectRowAtIndexPath:
 */
- (void)telephoneRowSelected;
- (void)directionsRowSelected;

/**
 * Actions based on user interactions
 */
- (IBAction)phoneButtonPressed:(id)sender;
- (IBAction)directionsButtonSelected:(id)sender;

@end
