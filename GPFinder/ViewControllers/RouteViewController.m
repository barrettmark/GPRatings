//
//  RouteViewController.m
//  GPFInder
//
//  Created by barrettmark.com on 22/03/2012.
//

#import "RouteViewController.h"

@implementation RouteViewController

- (void)viewDidLoad {
    [super viewDidLoad];
    
    self.routeOverlayView = [[UICRouteOverlayMapView alloc] initWithMapView:self.mapView];
    
    // The Singleton prevents directions loading up the second time.
    // Create a new instance and investigate later
    self.directions = [[UICGDirections alloc] init];
    [self.directions setDelegate:self];
}

#pragma mark <UICGDirectionsDelegate> Methods

- (BOOL)shouldAutorotateToInterfaceOrientation:(UIInterfaceOrientation)interfaceOrientation {
    return (interfaceOrientation == UIInterfaceOrientationPortrait);
}

- (void)updateDirections {
    [[UIApplication sharedApplication] setNetworkActivityIndicatorVisible:YES];
    
    UICGDirectionsOptions *options = [[UICGDirectionsOptions alloc] init];
	options.travelMode = UICGTravelModeDriving;
    [self.directions loadWithStartPoint:self.startPoint endPoint:self.endPoint options:options];
}

- (void)directionsDidFinishInitialize:(UICGDirections *)directions {
    [self updateDirections];
}

- (void)directions:(UICGDirections *)directions didFailInitializeWithError:(NSError *)error {
	[[UIApplication sharedApplication] setNetworkActivityIndicatorVisible:NO];
    
    UIAlertView *alert = [[UIAlertView alloc] initWithTitle: @"Error" message:@"Error fetching directions." delegate: nil cancelButtonTitle: @"Dismiss" otherButtonTitles: nil];  
    [alert show];
    [self.navigationController popViewControllerAnimated:NO];
}

- (void)directionsDidUpdateDirections:(UICGDirections *)directions {
	[[UIApplication sharedApplication] setNetworkActivityIndicatorVisible:NO];
    
    // Overlay polylines
	UICGPolyline *polyline = [self.directions polyline];
	NSArray *routePoints = [polyline routePoints];
	[self.routeOverlayView setRoutes:routePoints];
    
    // Add annotations
	UICRouteAnnotation *startAnnotation = [[UICRouteAnnotation alloc] initWithCoordinate:[[routePoints objectAtIndex:0] coordinate] title:@"Current location" annotationType:UICRouteAnnotationTypeStart];
	UICRouteAnnotation *endAnnotation = [[UICRouteAnnotation alloc] initWithCoordinate:[[routePoints lastObject] coordinate] title:self.endPoint annotationType:UICRouteAnnotationTypeEnd];
    
    [self.mapView addAnnotations:[NSArray arrayWithObjects:startAnnotation, endAnnotation, nil]];
}

#pragma mark <MKMapViewDelegate> Methods

- (void)mapView:(MKMapView *)mapView regionWillChangeAnimated:(BOOL)animated {
	self.routeOverlayView.hidden = YES;
}

- (void)mapView:(MKMapView *)mapView regionDidChangeAnimated:(BOOL)animated {
	self.routeOverlayView.hidden = NO;
	[self.routeOverlayView setNeedsDisplay];
}

- (MKAnnotationView *)mapView:(MKMapView *)mapView viewForAnnotation:(id<MKAnnotation>)annotation {
	static NSString *identifier = @"RoutePinAnnotation";
	
	if ([annotation isKindOfClass:[UICRouteAnnotation class]]) {
		MKPinAnnotationView *pinAnnotation = (MKPinAnnotationView *)[mapView dequeueReusableAnnotationViewWithIdentifier:identifier];
		if(!pinAnnotation) {
			pinAnnotation = [[MKPinAnnotationView alloc] initWithAnnotation:annotation reuseIdentifier:identifier];
		}
		
		if ([(UICRouteAnnotation *)annotation annotationType] == UICRouteAnnotationTypeStart) {
			pinAnnotation.pinColor = MKPinAnnotationColorGreen;
		} else if ([(UICRouteAnnotation *)annotation annotationType] == UICRouteAnnotationTypeEnd) {
			pinAnnotation.pinColor = MKPinAnnotationColorRed;
		} else {
			pinAnnotation.pinColor = MKPinAnnotationColorPurple;
		}
		
		pinAnnotation.animatesDrop = YES;
		pinAnnotation.enabled = YES;
		pinAnnotation.canShowCallout = YES;
		return pinAnnotation;
	} else {
		return [self.mapView viewForAnnotation:self.mapView.userLocation];
	}
}

@end
