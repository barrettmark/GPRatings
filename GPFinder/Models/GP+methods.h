//
//  GP+methods.h
//  GPFInder
//
//  Created by barrettmark.com on 12/05/2012.
//

#import <UIKit/UIKit.h>
#import <MapKit/MapKit.h>

#import "GP.h"

@interface GP (Category)

/**
 * With a given location, find the closest GPS.
 */
+ (NSArray *)findClosestGPsFromLocation:(CLLocation *)location;

/**
 *  Find GPs within a location
 *  
 *  @param location queried location
 *  @param range range for search
 *  
 *  @return sorted array of GPs
 */
+ (NSArray *)findClosestGPsFromLocation:(CLLocation *)location withinRange:(NSRange)range;

/**
 *  @see findClosestGPSFromLocation
 *  
 *  @param location current location
 *  @param count limit results by count
 *  
 *  @return sorted array of GPs
 */
+ (NSArray *)findClosestGPsFromLocation:(CLLocation *)location withCount:(NSInteger)count;

/**
 * With a given location, find the closest GPs sorted by distance.
 */
+ (NSArray *)findClosestGPsSortedByDistanceFromLocation:(CLLocation *)location;
+ (NSArray *)findClosestGPsSortedByDistanceFromLocation:(CLLocation *)location withinRange:(NSRange)range;
+ (NSArray *)findClosestGPsSortedByDistanceFromLocation:(CLLocation *)location withCount:(NSInteger)count;
- (NSNumber *)distanceInMiles;

/**
 * Methods to make up for the fact that the parsed data isn't perfect 
 * Some properties referer to the number of responses as respondants and others use
 * Number of patients. These methods help keep the model consistent.
 */
- (id)wereEligibleWomenScreenedRespondents;
- (id)wereBloodPressureTestsRecentlyCompletedForPatientsWithCoronaryHeartDiseaseRespondents;
- (id)wereAsthmaPatientsRecentlyGivenAnAsthmaReviewRespondents;
- (id)didCancerPatientsRecentlyHaveACancerReviewRespondents;
- (id)wasRetinalScreeningRecentlyCompletedForDiabetesPatientsRespondents;

@end
