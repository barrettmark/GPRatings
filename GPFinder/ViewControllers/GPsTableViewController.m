//
//  GPsTableViewController.m
//  GPFInder
//
//  Created by barrettmark.com on 19/02/2012.
//

#import "GPsTableViewController.h"
#import "GPDetailViewController.h"
#import "MapSwitcherViewController.h"

#import "GP.h"

@implementation GPsTableViewController

- (void)viewDidAppear:(BOOL)animated
{
    [super viewDidAppear:animated];
    
    [self.navigationController setNavigationBarHidden:NO animated:YES];
}

#pragma mark - Table view data source

- (NSInteger)numberOfSectionsInTableView:(UITableView *)tableView {
    // Return the number of sections.
    return 1;
}

- (NSInteger)tableView:(UITableView *)tableView numberOfRowsInSection:(NSInteger)section {
    // Return the number of rows in the section.
    return [self.GPs count];
}

- (CGFloat)tableView:(UITableView *)tableView heightForRowAtIndexPath:(NSIndexPath *)indexPath {
    return 62.0;
}

- (UITableViewCell *)tableView:(UITableView *)tableView cellForRowAtIndexPath:(NSIndexPath *)indexPath {
    
    static NSString *CellIdentifier = @"GPsTableViewCell";
    
    UITableViewCell *cell = [tableView dequeueReusableCellWithIdentifier:CellIdentifier];
	if (cell == nil) {
        [[NSBundle mainBundle] loadNibNamed:@"GPTableViewCell" owner:self options:nil];
        cell = self.gpTableViewCell;
	}
    
    [cell setAccessoryType:UITableViewCellAccessoryDisclosureIndicator];

    if (indexPath.row % 2 == 0) {
        [cell setBackgroundColor:[UIColor colorWithRed:250.0 / 255 green:250.0 / 255 blue:250.0 / 255 alpha:1.0]]; 
    }
    
    GP *gp = [self.GPs objectAtIndex:indexPath.row];
    
    UILabel *label = (UILabel *)[cell viewWithTag:1];
    [label setText:[gp.practiceName capitalizedString]];
    
    UIImageView *imageView = (UIImageView *)[cell viewWithTag:2];
    NSString *imageName = [NSString stringWithFormat:@"%.1f-star.png", [gp.allStarRating doubleValue]];
    [imageView setImage:[UIImage imageNamed:imageName]];
    
    return cell;
}

- (void)tableView:(UITableView *)tableView didSelectRowAtIndexPath:(NSIndexPath *)indexPath {
    GP *gp = [self.GPs objectAtIndex:indexPath.row];

    GPDetailViewController *gpDetailViewController = [[GPDetailViewController alloc] initWithNibName:@"GPDetailView" bundle:nil];
    [gpDetailViewController setGp:gp];
    [gpDetailViewController setLocation:(CLLocation *)[self.parentViewController valueForKey:@"location"]];
    
    [self.tableView deselectRowAtIndexPath:indexPath animated:YES];
    
    UIBarButtonItem *backButton = [[UIBarButtonItem alloc] initWithTitle:@"Back" style:UIBarButtonItemStyleBordered target:nil action:nil]; 
    [self.navigationItem setBackBarButtonItem:backButton];
    MapSwitcherViewController *parentController = (MapSwitcherViewController *)self.parentViewController;
    [parentController stopListeningForOrientationChangeNotification];
    [self.parentViewController.navigationController pushViewController:gpDetailViewController animated:YES];
}

#pragma mark - UIViewController methods

/**
 * Method called before view is switched by parentViewController.
 *
 * Pressing "back" while in the map view results in seeing the FindGPViewController
 * view in landscape.
 *
 * We can no longer programatically change orientation so do the next best thing
 * and hide the back button while in landscape
 *
 * This needs to be unset in this controller.
 */
- (void)willMoveToParentViewController:(UIViewController *)parent
{
    [super willMoveToParentViewController:parent];
}

@end
