//
//  GPAnnotation.m
//  GPFInder
//
//  Created by barrettmark.com on 22/04/2012.
//

#import "GPAnnotation.h"

@implementation GPAnnotation

- (id)initWithLocation:(CLLocationCoordinate2D)coord {
    self = [super init];
    if (self) {
        _coordinate = coord;
    }
    return self;
}

@end
