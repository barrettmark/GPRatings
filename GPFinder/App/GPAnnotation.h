//
//  GPAnnotation.h
//  GPFInder
//
//  Created by barrettmark.com on 22/04/2012.
//

#import <Foundation/Foundation.h>

/**
 * This class is used to display a GP's location in the MapView
 *
 */
@interface GPAnnotation: NSObject <MKAnnotation> {
    CLLocationCoordinate2D _coordinate;
    NSUInteger _index;
    NSString *_title;
    NSString *_subtitle;
    NSNumber *_stars;
} 

/**
 *  Default properties for an MKAnnotation instance
 */

@property (nonatomic, readonly) CLLocationCoordinate2D coordinate;
@property (nonatomic) NSUInteger index;
@property (nonatomic, copy) NSString *title;
@property (nonatomic, copy) NSString *subtitle;

/**
 *  Amout of stars to display (or corresponding image to use) for the specific GP
 */
@property (nonatomic, retain) NSNumber *stars;

- (id)initWithLocation:(CLLocationCoordinate2D)coord;

@end