//
//  MapViewController.m
//  GPFInder
//
//  Created by barrettmark.com on 20/02/2012.
//

#import "MapViewController.h"

#import "GP.h"
#import "UICGDirectionsOptions.h"
#import "GPAnnotation.h"
#import "GPDetailViewController.h"

@implementation MapViewController

#pragma mark - View lifecycle

- (void)viewDidAppear:(BOOL)animated
{
    [super viewDidAppear:animated];
    
    [self.navigationController setNavigationBarHidden:YES animated:YES];
    
    GPAnnotation *locationAnnotation = [[GPAnnotation alloc] initWithLocation:self.location.coordinate];
    [locationAnnotation setTitle:@"Current location"];
    [self.mapView addAnnotation:locationAnnotation];

    for (GP *gp in self.GPs) {
        
        CLLocationCoordinate2D coord = {
            (double)[gp.latitude doubleValue],
            (double)[gp.longitude doubleValue]
        };
        
        GPAnnotation *pointAnnotation = [[GPAnnotation alloc] initWithLocation:coord];
        [pointAnnotation setTitle:gp.practiceName];
        [pointAnnotation setSubtitle:gp.postcode];
        [pointAnnotation setIndex:[self.GPs indexOfObject:gp]];
        [pointAnnotation setStars:gp.allStarRating];
        
        [self.mapView addAnnotation:pointAnnotation];
    }

    if (self.startingLocation) {
		[self zoomToStartingLocation];
	} else {
		[self zoomToLeeds];
	}

    [self zoomMapToFit];
}

#pragma mark - MapViewController methods

- (void)zoomToLeeds {
    CLLocationCoordinate2D coord = CLLocationCoordinate2DMake(53.801279, -1.548567);
    MKCoordinateSpan span = MKCoordinateSpanMake(1, 1);
    MKCoordinateRegion region = MKCoordinateRegionMake(coord, span);
    [self.mapView setRegion:region animated:NO];
}

- (void)zoomToStartingLocation {
    MKCoordinateSpan span = MKCoordinateSpanMake(1, 1);
    MKCoordinateRegion region = MKCoordinateRegionMake(self.startingLocation.coordinate, span);
    [self.mapView setRegion:region];
}

- (void)zoomMapToFit {

	#define DBL_Max = 0.0;

	CLLocationDegrees minLatitude = DBL_MAX;
	CLLocationDegrees maxLatitude = -DBL_MAX;
	CLLocationDegrees minLongitude = DBL_MAX;
	CLLocationDegrees maxLongitude = -DBL_MAX;

	for (MKPointAnnotation *annotation in self.mapView.annotations) {
	
		double annotationLat = annotation.coordinate.latitude;
		double annotationLong = annotation.coordinate.longitude;
		minLatitude = fmin(annotationLat, minLatitude);
		maxLatitude = fmax(annotationLat, maxLatitude);
		minLongitude = fmin(annotationLong, minLongitude);
		maxLongitude = fmax(annotationLong, maxLongitude);
	}
	
	CLLocationCoordinate2D maxCoords = CLLocationCoordinate2DMake(maxLatitude, maxLongitude);
	CLLocationCoordinate2D minCoords = CLLocationCoordinate2DMake(minLatitude, minLongitude);
	
	[self zoomMapToFitMaxCoords:maxCoords minCoords:minCoords];
}

- (void)zoomMapToFitMaxCoords:(CLLocationCoordinate2D)maxCoords minCoords:(CLLocationCoordinate2D)minCoords {

	// Credit: http://stackoverflow.com/questions/3434020/mkmapview-zoom-to-bounds-with-multiple-markers

	// pad our map by 10% around the farthest annotations
	#define MAP_PADDING 1.3

	// we'll make sure that our minimum vertical span is about a kilometer
	// there are ~111km to a degree of latitude. regionThatFits will take care of
	// longitude, which is more complicated, anyway. 
	#define MINIMUM_VISIBLE_LATITUDE 0.01

	MKCoordinateRegion region;
	region.center.latitude = (minCoords.latitude + maxCoords.latitude) / 2;
	region.center.longitude = (minCoords.longitude + maxCoords.longitude) / 2;

	region.span.latitudeDelta = (maxCoords.latitude - minCoords.latitude) * MAP_PADDING;

	region.span.latitudeDelta = (region.span.latitudeDelta < MINIMUM_VISIBLE_LATITUDE)
		? MINIMUM_VISIBLE_LATITUDE 
		: region.span.latitudeDelta;

	region.span.longitudeDelta = (maxCoords.longitude - minCoords.longitude) * MAP_PADDING;

	MKCoordinateRegion scaledRegion = [self.mapView regionThatFits:region];
	[self.mapView setRegion:scaledRegion animated:NO];
}

#pragma mark - MapView delegate methods

- (MKAnnotationView *)mapView:(MKMapView *)mapView viewForAnnotation:(GPAnnotation *)annotation
{
    static NSString *viewIdentifier = @"MapViewController";
    MKPinAnnotationView *annotationView = (MKPinAnnotationView *) [mapView dequeueReusableAnnotationViewWithIdentifier:viewIdentifier];
    if (annotationView == nil) {
        annotationView = [[MKPinAnnotationView alloc] initWithAnnotation:annotation reuseIdentifier:viewIdentifier];
    }

    if (self.location.coordinate.latitude != annotation.coordinate.latitude
        && self.location.coordinate.longitude != annotation.coordinate.longitude) {

        NSString *imageName = [NSString stringWithFormat:@"%.1f-star-pin.png", [annotation.stars doubleValue]];        
        [annotationView setImage:[UIImage imageNamed:imageName]];
    }
    
    [annotationView setCanShowCallout:YES];

    return annotationView;
}

#pragma mark - IBActions

- (IBAction)disclosureButtonPressed:(UIButton *)sender
{    
    GP *gp = [self.GPs objectAtIndex:sender.tag];
        
    GPDetailViewController *gpDetailViewController = [[GPDetailViewController alloc] initWithNibName:@"GPDetailView" bundle:nil];
    [gpDetailViewController setGp:gp];
	
	UINavigationController *navigationController = self.navigationController;
	if (self.parentViewController) {
		navigationController = self.parentViewController.navigationController;
        [gpDetailViewController setLocation:(CLLocation *)[self.parentViewController valueForKey:@"location"]];
	}
    
    UIBarButtonItem *backButton = [[UIBarButtonItem alloc] initWithTitle:@"Back" style:UIBarButtonItemStyleBordered target:nil action:nil]; 
    [self.navigationItem setBackBarButtonItem:backButton]; 
    [navigationController pushViewController:gpDetailViewController animated:YES];
}

#pragma mark - UIViewController methods

- (BOOL)shouldAutorotateToInterfaceOrientation:(UIInterfaceOrientation)interfaceOrientation
{
    // Return YES for supported orientations
    return (interfaceOrientation == UIInterfaceOrientationPortrait);
}

- (NSUInteger)supportedInterfaceOrientations
{
    return UIInterfaceOrientationMaskAllButUpsideDown;
}

/**
 * Method called before view is switched by parentViewController.
 *
 * Pressing "back" while in the map view results in seeing the FindGPViewController
 * view in landscape.
 *
 * We can no longer programatically change orientation so do the next best thing
 * and hide the back button while in landscape
 */
- (void)willMoveToParentViewController:(UIViewController *)parent
{
    [super willMoveToParentViewController:parent];
}

@end
