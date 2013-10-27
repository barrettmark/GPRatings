//
//  GPsTableViewController.h
//  GPFInder
//
//  Created by barrettmark.com on 19/02/2012.
//

#import <UIKit/UIKit.h>

 /**
  *  This class displays lists of GPs
  */

@interface GPsTableViewController : UITableViewController  <UITableViewDataSource, UITableViewDelegate>

@property (retain, nonatomic) UIViewController *switcherViewController;

/**
 *  Custom table cell for displaying GP data
 */
@property (retain, nonatomic) IBOutlet UITableViewCell *gpTableViewCell;

/**
 *  GPs to display
 */
@property (retain, nonatomic) NSArray *GPs;

@end
