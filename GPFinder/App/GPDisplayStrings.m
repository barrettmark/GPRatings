//
//  GPDisplayStrings.m
//  GPFInder
//
//  Created by barrettmark.com on 01/05/2012.
//

#import "GPDisplayStrings.h"

@implementation GPDisplayStrings

-(id)init {
    
    if (self = [super init]) {
		_displayStringMappings = @{
			@"wouldYouRecommendYourGPSurgeryRating": @"Would patients recommend their GP Surgery to others?",
			@"patientSatisfactionWithOpeningHoursRating": @"Are patients happy with the surgery opening hours?",
		    @"howHelpfulWasTheReceptionistRating": @"How helpful was the receptionist?",
			@"wereYouAbleToSeeADoctorWithinTwoWorkingDaysRating": @"Are patients able to see a doctor within 2 working days?",
			@"patientConfidenceAndTrustInTheDoctorRating": @"Do patients have confidence and trust in their doctor?",
			@"didTheDoctorInvolveYouInDecisionsAboutYourCareRating": @"Do patients feel their doctor. involves them in decisions about their care?",
			@"wasItEasyToGetAnAppointmentWithANurseRating": @"Was it easy to get an appointment with a nurse?",
			 @"didTheNurseExplainTestsAndTreatmentsRating": @"Did the nurse explain tests and treatments?",
			@"didTheNurseTreatPatientsWithCareAndConcernRating": @"Did the nurse treat patients with care & concern?",
			@"wereEligibleWomenScreenedRating": @"Were eligible women screened?",
			@"wereBloodPressureTestsRecentlyCompletedForPatientsWithCoronaryHeartDiseaseRating": @"Were blood pressure tests recently completed for patients with coronary heart disease?",
			@"wereAsthmaPatientsRecentlyGivenAnAsthmaReviewRating": @"Were asthma patients recently given an asthma review?",
			   @"didCancerPatientsRecentlyHaveACancerReviewRating": @"Did cancer patients recently have a cancer review?",
			@"wasRetinalScreeningRecentlyCompletedForDiabetesPatientsRating": @"Was retinal screening recently completed for diabetes patients?",
		};
    }
    
    return self;
}

@end
