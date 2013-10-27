//
//  MapViewController.h
//  GPFInder
//
//  Created by barrettmark.com on 20/02/2012.
//

#import <UIKit/UIKit.h>

@interface MapViewController : UIViewController <MKMapViewDelegate>

@property (retain, nonatomic) IBOutlet MKMapView *mapView;

/**
 *  Array of GPs
 */
@property (retain, nonatomic) NSArray *GPs;

/**
 *  Starting location for map.
 */
@property (retain, nonatomic) CLLocation *startingLocation;

/**
 *  Location is the CLLocation of the user viewing the map
 */
@property (retain, nonatomic) CLLocation *location;

/**
 * Convenience methods to centre the map
 */
- (void)zoomToLeeds;

/**
 *  Zoom map to centre on self.startingLocation
 */
- (void)zoomToStartingLocation;

/**
 *  Zoom map to fit all points in self.GPs onto screen
 */
- (void)zoomMapToFit;

/**
 *  Zoom map to fit coords
 *  
 *  @param maxCoords
 *  @param minCoords
 */
- (void)zoomMapToFitMaxCoords:(CLLocationCoordinate2D)maxCoords minCoords:(CLLocationCoordinate2D)minCoords;

/**
 * Action for user interactions
 */
- (IBAction)disclosureButtonPressed:(id)sender;

@end
