//
//  MapSwitcherViewController.m
//  GPFinder
//
//  Created by barrettmark.com on 05/03/2012.
//

#import "MapSwitcherViewController.h"
#import "GP+methods.h"

@implementation MapSwitcherViewController

NSInteger const RESULTS_COUNT = 10;

#pragma mark - View lifecycle

- (void)viewWillAppear:(BOOL)animated
{
    [super viewWillAppear:animated];

    [self addChildViewController:self.landscapeViewController];
    [self addChildViewController:self.portraitViewController];

    [self.view addSubview:self.portraitViewController.view];
    [self.portraitViewController didMoveToParentViewController:self];
    
    [self listenForOrientationChangeNotifications];
	[[NSNotificationCenter defaultCenter] addObserver:self selector:@selector(switchView:) name:CHILD_VIEW_CONTROLLER_PUSHED_VIEW object:nil];
}

- (void)viewDidLoad
{    
    [super viewDidLoad];
    
    [self showLoaderWithText:@"Loading"];
    
    if (!self.postcode) {
        [self populateControllersOrFindCurrentLocation];
    }
    
    if (self.postcode) {
        [self getLocationFromPostcode:self.postcode withCompletionHandler:^(NSArray *placemarks, NSError *error) {
            
            if (error) {
                UIAlertView *alert = [[UIAlertView alloc] initWithTitle: @"Error" message:@"Error fetching location from postcode" delegate: nil cancelButtonTitle: @"Dismiss" otherButtonTitles: nil];
                [alert show];
                
                NSLog(@"Error fetching location from postcode: %@", self.postcode);
                
                [self.hud hide:YES];
                [self.navigationController popViewControllerAnimated:NO];
                
                return;
            }
            
            if ([placemarks count] > 0) {
                [self.hud hide:YES];
                
                CLPlacemark *placemark = (CLPlacemark *)[placemarks objectAtIndex:0];
                [self setLocation:[placemark location]];
                [self populateControllersOrFindCurrentLocation];
            }
        }];
    }
}

#pragma mark - MapSwitcherViewController methods

- (void)getLocationFromPostcode:(NSString *)postcode withCompletionHandler:(void (^)(NSArray *placemarks, NSError *error)) block
{
	CLGeocoder *geocoder = [[CLGeocoder alloc] init];
	[geocoder geocodeAddressString:[postcode stringByAppendingString:@", UK"] completionHandler:block];
}

- (void)listenForOrientationChangeNotifications
{
	UIDevice *device = [UIDevice currentDevice];
	[device beginGeneratingDeviceOrientationNotifications];
	NSNotificationCenter *notificationCenter = [NSNotificationCenter defaultCenter];
	[notificationCenter addObserver:self selector:@selector(orientationChanged:) name:UIDeviceOrientationDidChangeNotification object:device];
}

- (void)stopListeningForOrientationChangeNotification
{
	NSNotificationCenter *notificationCenter = [NSNotificationCenter defaultCenter];
	[notificationCenter removeObserver:self name:UIDeviceOrientationDidChangeNotification object:nil];
}

- (void)loadPortraitView
{    
    [self transitionFromViewController:self.landscapeViewController toViewController:self.portraitViewController];
}

- (void)loadLandscapeView
{    
	[self.landscapeViewController setLocation:self.location];    
    [self transitionFromViewController:self.portraitViewController toViewController:self.landscapeViewController];
}

- (void)switchView
{
	if ([self isOrientationPortrait] && ![self isPortraitViewControllerLoaded]) {
		[self loadPortraitView];
	} else if ([self isOrientationLandscape] && ![self isLandscapeViewControllerLoaded]) {
		[self loadLandscapeView];
	}
}

- (BOOL)isOrientationPortrait
{
	return (self.interfaceOrientation == UIInterfaceOrientationPortrait 
		|| self.interfaceOrientation == UIInterfaceOrientationPortraitUpsideDown);
}

- (BOOL)isOrientationLandscape
{
	return (self.interfaceOrientation == UIInterfaceOrientationLandscapeLeft
		|| self.interfaceOrientation == UIInterfaceOrientationLandscapeRight);
}

- (BOOL)isLandscapeViewControllerLoaded
{
    return (self.currentChildViewController == self.landscapeViewController);
}

- (BOOL)isPortraitViewControllerLoaded
{
    return (self.currentChildViewController == self.portraitViewController);
}

- (void)populateControllersOrFindCurrentLocation
{
    if (self.location) {
        [self populateControllersWithGPData];
    } else {
        [self findCurrentLocation];
    }
}

- (void)findCurrentLocation
{
    self.locationManager = [[CLLocationManager alloc] init];
    self.locationManager.delegate = self;
    [self.locationManager startUpdatingLocation];
}

- (void)populateControllersWithGPData
{
    self.gps = [GP findClosestGPsSortedByDistanceFromLocation:self.location withCount:RESULTS_COUNT];
    [self.landscapeViewController setValue:self.gps forKey:@"GPs"];
    [self.portraitViewController setValue:self.gps forKey:@"GPs"];
    [self.portraitViewController.tableView reloadData];
}

- (void)showLoaderWithText:(NSString *)text
{
    self.hud = [[MBProgressHUD alloc] initWithView:self.navigationController.view];
    [self.navigationController.view addSubview:self.hud];

    self.hud.removeFromSuperViewOnHide = YES;
    self.hud.dimBackground = YES;
    self.hud.labelText = text;   
    [self.hud show:YES];
}

#pragma mark - Orientation Switch event

- (void)orientationChanged:(id)sender
{
	[self switchView];
}

#pragma mark - CLLocation manager delegate methods

- (void)locationManager:(CLLocationManager *)manager didUpdateToLocation:(CLLocation *)newLocation fromLocation:(CLLocation *)oldLocation
{
    if (!self.location) {
        [self.hud hide:YES];
        [self setLocation:newLocation];
        [self.locationManager stopUpdatingLocation];
        [self populateControllersWithGPData];
    }
}

- (void)locationManager:(CLLocationManager *)manager didChangeAuthorizationStatus:(CLAuthorizationStatus)status
{    
    if (status == kCLAuthorizationStatusDenied) {
        [self.hud hide:YES];
        [self.navigationController popViewControllerAnimated:YES];
    }
}

- (void)locationManager:(CLLocationManager *)manager didFailWithError:(NSError *)error
{    
    // User has clicked "Don't allow" location services
    // Nav back to findGPsViewController
    if (error.code == kCLErrorDenied) {
        
        UIAlertView *alert = [[UIAlertView alloc] initWithTitle: @"Error" message: @"Location services need to be enabled to use this feature. To enable go to Settings > Location Services" delegate: nil cancelButtonTitle: @"Dismiss" otherButtonTitles: nil];  
        [alert show];
        
        [self.hud hide:YES];
        [self.navigationController popViewControllerAnimated:NO];        
    }
}

#pragma mark - UIViewController methods

- (void)transitionFromViewController:(UIViewController *)fromViewController toViewController:(UIViewController *)toViewController
{
    [toViewController willMoveToParentViewController:self];
    [toViewController.view setFrame:self.view.frame];
    
    [self transitionFromViewController:fromViewController toViewController:toViewController duration:2.0f options:UIViewAnimationCurveEaseInOut animations:^{} completion:^(BOOL finished) {
        [self setCurrentChildViewController:toViewController];
        [toViewController didMoveToParentViewController:self];
    }];
}

- (BOOL)shouldAutorotateToInterfaceOrientation:(UIInterfaceOrientation)toInterfaceOrientation
{
    return (toInterfaceOrientation == UIInterfaceOrientationPortrait ||
            toInterfaceOrientation == UIInterfaceOrientationLandscapeLeft ||
            toInterfaceOrientation == UIInterfaceOrientationLandscapeRight);
}

@end
