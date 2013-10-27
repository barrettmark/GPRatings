//
//  GP+methods.m
//  GPFInder
//
//  Created by barrettmark.com on 12/05/2012.
//

#import "GP+methods.h"

@implementation GP (Category)

+ (NSArray *)findClosestGPsFromLocation:(CLLocation *)location {

    NSArray *gps = [GP findAll];
	for (GP *gp in gps) {
        CLLocation *gpLocation = [[CLLocation alloc] initWithLatitude:[gp.latitude doubleValue] longitude:[gp.longitude doubleValue]];
		CLLocationDistance distance = [gpLocation distanceFromLocation:location];
        [gp setDistance:[NSNumber numberWithDouble:distance]];
    }
    
	return gps;	
}

+ (NSArray *)findClosestGPsFromLocation:(CLLocation *)location withinRange:(NSRange)range {
    NSArray *closetGPs = [self findClosestGPsFromLocation:location];
    return [closetGPs subarrayWithRange:range];
}

+ (NSArray *)findClosestGPsFromLocation:(CLLocation *)location withCount:(NSInteger)count {
    return [self findClosestGPsFromLocation:location withinRange:NSMakeRange(0, count)];
}

// Note function relies upon distance being calculated first.
+ (NSArray *)findClosestGPsSortedByDistanceFromLocation:(CLLocation *)location {
    NSArray *closestGps = [self findClosestGPsFromLocation:location];
    return [closestGps sortedArrayUsingComparator:^(id a, id b) {
        return [(NSNumber *)[a valueForKey:@"distance"] compare:(NSNumber *)[b valueForKey:@"distance"]];
    }];
}

+ (NSArray *)findClosestGPsSortedByDistanceFromLocation:(CLLocation *)location withinRange:(NSRange)range {
    NSArray *closetGPs = [self findClosestGPsSortedByDistanceFromLocation:location];
    return [closetGPs subarrayWithRange:range];
}

+ (NSArray *)findClosestGPsSortedByDistanceFromLocation:(CLLocation *)location withCount:(NSInteger)count {
    return [self findClosestGPsSortedByDistanceFromLocation:location withinRange:NSMakeRange(0, count)];
}

- (NSNumber *)distanceInMiles {
    double milesInMeters = [self.distance doubleValue] / 1609.344;
    return [NSNumber numberWithDouble:milesInMeters];
}

// Methods to make up for the fact that the parsed data isn't perfect
- (id)wereEligibleWomenScreenedRespondents {
    return [self wereEligibleWomenScreenedNumberOfPatients];
}

- (id)wereBloodPressureTestsRecentlyCompletedForPatientsWithCoronaryHeartDiseaseRespondents {
    return [self wereBloodPressureTestsRecentlyCompletedForPatientsWithCoronaryHeartDiseaseNumberOfPatients];
}

- (id)wereAsthmaPatientsRecentlyGivenAnAsthmaReviewRespondents {
    return [self wereAsthmaPatientsRecentlyGivenAnAsthmaReviewNumberOfPatients];
}

- (id)didCancerPatientsRecentlyHaveACancerReviewRespondents {
    return [self didCancerPatientsRecentlyHaveACancerReviewNumberOfPatients];
}

- (id)wasRetinalScreeningRecentlyCompletedForDiabetesPatientsRespondents {
    return [self wasRetinalScreeningRecentlyCompletedForDiabetesPatientsNumberOfPatients]
    ;
}

@end