//
//  FindGPsViewController.m
//  GPFinder
//
//  Created by barrettmark.com on 05/03/2012.
//

#import "FindGPsViewController.h"
#import "GPsTableViewController.h"
#import "MapViewController.h"
#import "AboutViewController.h"

#import "GP.h"
#import "AppDelegate.h"

@implementation FindGPsViewController

#pragma mark - View lifecycle

- (void)viewDidLoad
{
    [super viewDidLoad];
        
    self.navigationItem.rightBarButtonItem = [[UIBarButtonItem alloc] initWithTitle:@"About" style:UIBarButtonItemStyleBordered target:self action:@selector(aboutButtonPressed:)];
}

- (void)loadMapSwitcherViewController {
	[self loadMapSwitcherViewControllerWithPlacemark:nil];
}

- (void)loadMapSwitcherViewControllerWithPlacemark:(CLPlacemark *)placemark {
	MapSwitcherViewController *mapSwitcherViewController = [[MapSwitcherViewController alloc] initWithNibName:@"MapSwitcherView" bundle:nil];
	[mapSwitcherViewController setLocation:placemark.location];
    [self loadMapSwitcherViewController:mapSwitcherViewController];
}

- (void)loadMapSwitcherViewControllerWithPostcode:(NSString *)postcode {
	MapSwitcherViewController *mapSwitcherViewController = [[MapSwitcherViewController alloc] initWithNibName:@"MapSwitcherView" bundle:nil];
	[mapSwitcherViewController setPostcode:postcode];
    [self loadMapSwitcherViewController:mapSwitcherViewController];
}

- (void)loadMapSwitcherViewController:(MapSwitcherViewController *)mapSwitcherViewController {

    GPsTableViewController *gpsTableViewController = [[GPsTableViewController alloc] initWithNibName:@"GPsTableView" bundle:nil];
	MapViewController *mapViewController = [[MapViewController alloc] initWithNibName:@"MapView" bundle:nil];
    
	[mapSwitcherViewController setPortraitViewController:gpsTableViewController];
	[mapSwitcherViewController setLandscapeViewController:mapViewController];

    UIBarButtonItem *backButton = [[UIBarButtonItem alloc] initWithTitle:@"Back" style:UIBarButtonItemStyleBordered target:nil action:nil]; 
    [[self navigationItem] setBackBarButtonItem:backButton]; 
	[self.navigationController pushViewController:mapSwitcherViewController animated:YES];
}

- (BOOL)isValidPostcode:(NSString *)postcode {
	return true;
}

- (BOOL)textFieldShouldReturn:(UITextField *)textField {
    [textField resignFirstResponder];
    [self postcodeSubmitButtonPressed:textField];
    return YES;
}

- (NSString *)normalisedPostcodeText {
    NSString *postcodeText = [self.postcode text];
    NSCharacterSet *charactersToRemove = [[NSCharacterSet alphanumericCharacterSet] invertedSet];
    return [[postcodeText componentsSeparatedByCharactersInSet:charactersToRemove] componentsJoinedByString:@""];
}

#pragma UITextField delegate methods

- (BOOL)textField:(UITextField *)textField shouldChangeCharactersInRange:(NSRange)range
replacementString:(NSString *)string {
    
    // Check if the added string contains lowercase characters.
    NSRange lowercaseCharRange = [string rangeOfCharacterFromSet:[NSCharacterSet lowercaseLetterCharacterSet]];
    if (lowercaseCharRange.location != NSNotFound) {
        
        textField.text = [textField.text stringByReplacingCharactersInRange:range withString:[string uppercaseString]];
        
        return NO;
    }
    
    return YES;
}

#pragma mark - Actions

- (IBAction)aboutButtonPressed:(id)sender {
    [self.postcode resignFirstResponder];
    AboutViewController *aboutViewController = [[AboutViewController alloc] initWithNibName:@"AboutView" bundle:nil];
    [self.navigationController presentModalViewController:aboutViewController animated:YES];
}

- (IBAction)currentLocationButtonPressed:(id)sender {
	[self loadMapSwitcherViewController];
}

- (IBAction)postcodeSubmitButtonPressed:(id)sender {
    
    NSString *postcodeText = [self normalisedPostcodeText];
    if (postcodeText.length == 0) {
        return;
    }
    
    [self.postcode setText:postcodeText];
        
	if (![self isValidPostcode:postcodeText]) {
		// error !
		return;
	}
	
    [self.postcode resignFirstResponder];
    [self loadMapSwitcherViewControllerWithPostcode:postcodeText];
}

/**
 * iOS5 only. This method is deprecated in iOS6.
 *
 * @see supportedInterfaceOrientations
 */
- (BOOL)shouldAutorotateToInterfaceOrientation:(UIInterfaceOrientation)toInterfaceOrientation
{
    return (toInterfaceOrientation == UIInterfaceOrientationPortrait);
}

/**
 * iOS6 only.
 *
 * replaces shouldAutorotateToInterfaceOrientation:
 */
- (NSUInteger)supportedInterfaceOrientations
{
    return UIInterfaceOrientationMaskPortrait;
}

@end
