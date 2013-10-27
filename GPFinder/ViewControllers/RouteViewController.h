//
//  RouteViewController.h
//  GPFInder
//
//  Created by barrettmark.com on 22/03/2012.
//

#import <UIKit/UIKit.h>

#import "UICGDirections.h"
#import "UICRouteOverlayMapView.h"
#import "UICRouteAnnotation.h"

@interface RouteViewController : UIViewController <MKMapViewDelegate, UICGDirectionsDelegate>

@property (retain, nonatomic) IBOutlet MKMapView *mapView; 
@property (nonatomic) UICGTravelModes travelMode;
@property (retain, nonatomic) UICRouteOverlayMapView *routeOverlayView;
@property (retain, nonatomic) UICGDirections *directions;
@property (retain, nonatomic) NSString *startPoint;
@property (retain, nonatomic) CLLocation *startLocation;
@property (retain, nonatomic) NSString *endPoint;
@property (retain, nonatomic) CLLocation *endLocation;

- (void)updateDirections;

@end