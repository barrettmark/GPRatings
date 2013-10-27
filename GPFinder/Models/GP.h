//
//  GP.h
//  GP Ratings
//
//  Created by barrettmark.com on 01/10/2012.
//

#import <Foundation/Foundation.h>
#import <CoreData/CoreData.h>


@interface GP : NSManagedObject

@property (nonatomic, retain) NSNumber * ageBreakdown0to14;
@property (nonatomic, retain) NSNumber * ageBreakdown15to44;
@property (nonatomic, retain) NSNumber * ageBreakdown45to74;
@property (nonatomic, retain) NSNumber * ageBreakdown75;
@property (nonatomic, retain) NSNumber * chronicObstructivePulmonaryDiseaseValue;
@property (nonatomic, retain) NSNumber * coronaryHeartDiseaseValue;
@property (nonatomic, retain) NSNumber * didCancerPatientsRecentlyHaveACancerReviewNumberOfPatients;
@property (nonatomic, retain) NSNumber * didTheDoctorInvolveYouInDecisionsAboutYourCareRespondents;
@property (nonatomic, retain) NSNumber * didTheNurseExplainTestsAndTreatmentsRespondents;
@property (nonatomic, retain) NSNumber * didTheNurseTreatPatientsWithCareAndConcernRespondents;
@property (nonatomic, retain) NSNumber * eastings;
@property (nonatomic, retain) NSNumber * femaleGPs;
@property (nonatomic, retain) NSNumber * howHelpfulWasTheReceptionistRespondents;
@property (nonatomic, retain) NSNumber * hypertensionValue;
@property (nonatomic, retain) NSNumber * maleGPs;
@property (nonatomic, retain) NSNumber * numberOfPatientsWithChronicObstructivePulmonaryDiseaseNumberOfPatients;
@property (nonatomic, retain) NSNumber * numberOfPatientsWithCoronaryHeartDiseaseNumberOfPatients;
@property (nonatomic, retain) NSNumber * numberOfPatientsWithHypertensionNumberOfPatients;
@property (nonatomic, retain) NSNumber * numberOfPatientsWithStrokeNumberOfPatients;
@property (nonatomic, retain) NSNumber * overallPrevalence;
@property (nonatomic, retain) NSNumber * patientConfidenceAndTrustInTheDoctorRespondents;
@property (nonatomic, retain) NSNumber * patientSatisfactionWithOpeningHoursRespondents;
@property (nonatomic, retain) NSNumber * strokeValue;
@property (nonatomic, retain) NSNumber * wasItEasyToGetAnAppointmentWithANurseRespondents;
@property (nonatomic, retain) NSNumber * wasRetinalScreeningRecentlyCompletedForDiabetesPatientsNumberOfPatients;
@property (nonatomic, retain) NSNumber * wereAsthmaPatientsRecentlyGivenAnAsthmaReviewNumberOfPatients;
@property (nonatomic, retain) NSNumber * wereBloodPressureTestsRecentlyCompletedForPatientsWithCoronaryHeartDiseaseNumberOfPatients;
@property (nonatomic, retain) NSNumber * wereEligibleWomenScreenedNumberOfPatients;
@property (nonatomic, retain) NSNumber * wereYouAbleToSeeADoctorWithinTwoWorkingDaysRespondents;
@property (nonatomic, retain) NSNumber * wouldYouRecommendYourGPSurgeryRespondents;
@property (nonatomic, retain) NSDecimalNumber * latitude;
@property (nonatomic, retain) NSDecimalNumber * longitude;
@property (nonatomic, retain) NSNumber * allStarRating;
@property (nonatomic, retain) NSNumber * didCancerPatientsRecentlyHaveACancerReviewRating;
@property (nonatomic, retain) NSNumber * didTheDoctorInvolveYouInDecisionsAboutYourCareRating;
@property (nonatomic, retain) NSNumber * didTheNurseExplainTestsAndTreatmentsRating;
@property (nonatomic, retain) NSNumber * didTheNurseTreatPatientsWithCareAndConcernRating;
@property (nonatomic, retain) NSNumber * doctorOverallStarRating;
@property (nonatomic, retain) NSNumber * howHelpfulWasTheReceptionistRating;
@property (nonatomic, retain) NSNumber * nurseOverallStarRating;
@property (nonatomic, retain) NSNumber * outcomesOverallStarRating;
@property (nonatomic, retain) NSNumber * overallStarRating;
@property (nonatomic, retain) NSNumber * patientConfidenceAndTrustInTheDoctorRating;
@property (nonatomic, retain) NSNumber * patientSatisfactionWithOpeningHoursRating;
@property (nonatomic, retain) NSNumber * wasItEasyToGetAnAppointmentWithANurseRating;
@property (nonatomic, retain) NSNumber * wasRetinalScreeningRecentlyCompletedForDiabetesPatientsRating;
@property (nonatomic, retain) NSNumber * wereAsthmaPatientsRecentlyGivenAnAsthmaReviewRating;
@property (nonatomic, retain) NSNumber * wereBloodPressureTestsRecentlyCompletedForPatientsWithCoronaryHeartDiseaseRating;
@property (nonatomic, retain) NSNumber * wereEligibleWomenScreenedRating;
@property (nonatomic, retain) NSNumber * wereYouAbleToSeeADoctorWithinTwoWorkingDaysRating;
@property (nonatomic, retain) NSNumber * wouldYouRecommendYourGPSurgeryRating;
@property (nonatomic, retain) NSString * address1;
@property (nonatomic, retain) NSString * address2;
@property (nonatomic, retain) NSString * address3;
@property (nonatomic, retain) NSString * address4;
@property (nonatomic, retain) NSString * deprivationLevel;
@property (nonatomic, retain) NSString * northings;
@property (nonatomic, retain) NSString * postcode;
@property (nonatomic, retain) NSString * practiceCode;
@property (nonatomic, retain) NSString * practiceName;
@property (nonatomic, retain) NSString * telephone;
@property (nonatomic, retain) NSString * totalPatientsPerGP;
@property (nonatomic, retain) NSString * totalRegisteredList;
@property (nonatomic, retain) NSNumber * distance;

@end
