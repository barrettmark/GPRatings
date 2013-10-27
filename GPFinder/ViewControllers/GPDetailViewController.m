//
//  GPDetailViewController.m
//  GPFInder
//
//  Created by barrettmark.com on 20/02/2012.
//

#import "GPDetailViewController.h"

#import "RouteViewController.h"
#import "RootViewController.h"

#import "GPDisplayStrings.h"

@implementation GPDetailViewController

#pragma mark - View lifecycle

- (void)viewDidLoad {

    [super viewDidLoad];
        
    [self.nameLabel setText:[self.gp practiceName]];
    self.gpDetailStrings = [[GPDisplayStrings alloc] init];
    
    NSArray *addressComponents = [NSArray arrayWithObjects:[self.gp address1], [self.gp address2], [self.gp address3], nil];
    NSString *addressString = [addressComponents componentsJoinedByString:@" "];
    [self.addressLabel setText:addressString];
    
    NSString *imageName = [NSString stringWithFormat:@"%.1f-star.png", [self.gp.allStarRating doubleValue]];
    [self.ratingImageView setImage:[UIImage imageNamed:imageName]];
    
    [self.phoneButton setTitle:[self.gp telephone] forState:UIControlStateNormal];

    self.keys = @[
		@"wouldYouRecommendYourGPSurgeryRating",
		@"patientSatisfactionWithOpeningHoursRating",
		@"howHelpfulWasTheReceptionistRating",
		@"wereYouAbleToSeeADoctorWithinTwoWorkingDaysRating",
		@"patientConfidenceAndTrustInTheDoctorRating",
		@"didTheDoctorInvolveYouInDecisionsAboutYourCareRating",
		@"wasItEasyToGetAnAppointmentWithANurseRating",
		@"didTheNurseExplainTestsAndTreatmentsRating",
		@"didTheNurseTreatPatientsWithCareAndConcernRating",
		@"wereEligibleWomenScreenedRating",
		@"wereBloodPressureTestsRecentlyCompletedForPatientsWithCoronaryHeartDiseaseRating",
		@"wereAsthmaPatientsRecentlyGivenAnAsthmaReviewRating",
		@"didCancerPatientsRecentlyHaveACancerReviewRating",
		@"wasRetinalScreeningRecentlyCompletedForDiabetesPatientsRating",
	];
            
    [self.maleGPsLabel setText:[NSString stringWithFormat:@"%d", [self.gp.maleGPs intValue]]];
    [self.femaleGPsLabel setText:[NSString stringWithFormat:@"%d", [self.gp.femaleGPs intValue]]];
    [self.distanceLabel setText:[NSString stringWithFormat:@"%.2f", [self.gp.distanceInMiles doubleValue]]];
}

- (void)viewDidUnload
{
    [self setNameLabel:nil];
    [self setAddressLabel:nil];
    [self setPhoneButton:nil];
    [self setRatingImageView:nil];

    [super viewDidUnload];
}

- (NSString *)textForKey:(NSString *)key {
	return (NSString *)[self.gp valueForKey:key];
}

- (NSString *)keyForIndexPath:(NSIndexPath *)indexPath {
    return [self.keys objectAtIndex:indexPath.row];
}

- (void)makeCall:(NSString *)phoneNumber {
	NSString *phoneString = [[NSString alloc] initWithFormat:@"tel:%@",phoneNumber];
    phoneString = [phoneString stringByReplacingOccurrencesOfString:@" " withString:@""];
    NSURL *phoneURL = [[NSURL alloc] initWithString:phoneString];
	[[UIApplication sharedApplication] openURL:phoneURL];
}

#pragma mark - Table view data source

- (NSInteger)numberOfSectionsInTableView:(UITableView *)tableView {
    // Return the number of sections.
    return 1;
}

- (NSInteger)tableView:(UITableView *)tableView numberOfRowsInSection:(NSInteger)section {
    // Return the number of rows in the section.
    return [self.keys count];
}

- (CGFloat)tableView:(UITableView *)tableView heightForRowAtIndexPath:(NSIndexPath *)indexPath {
    return 65.0;
}

- (UITableViewCell *)tableView:(UITableView *)tableView cellForRowAtIndexPath:(NSIndexPath *)indexPath {
    
    static NSString *CellIdentifier = @"GPDetailTableViewCell";
    
    UITableViewCell *cell = [tableView dequeueReusableCellWithIdentifier:CellIdentifier];
    if (cell == nil) {
        [[NSBundle mainBundle] loadNibNamed:@"GPDetailTableViewCell" owner:self options:nil];
        cell = self.gpTableViewCell;
	}
    
    [cell setSelectionStyle:UITableViewCellSelectionStyleNone];
    
    UILabel *label = (UILabel *)[cell viewWithTag:1];
    UIImageView *imageView = (UIImageView *)[cell viewWithTag:2];
    UILabel *respondentsLabel = (UILabel *)[cell viewWithTag:3];
    UILabel *noDataLabel = (UILabel *)[cell viewWithTag:4];
    
    [noDataLabel setHidden:YES];
    
    NSString *key = [self keyForIndexPath:indexPath];

    [label setText:[self.gpDetailStrings.displayStringMappings objectForKey:key]];

    double rating = [[self.gp valueForKey:key] doubleValue];
    if (rating == 0) {
        [noDataLabel setHidden:NO];
        [imageView setHidden:YES];
        [respondentsLabel setHidden:YES];
    }

    NSString *imageName = [NSString stringWithFormat:@"%.1f-star.png", rating];
    [imageView setImage:[UIImage imageNamed:imageName]];

    NSString *respondentsKey = [key stringByReplacingOccurrencesOfString:@"Rating" withString:@"Respondents"];
    NSNumber *respondents = (NSNumber *)[self.gp valueForKey:respondentsKey];
    [respondentsLabel setText:[NSString stringWithFormat:@"%d patients", [respondents intValue]]];
    
    return cell;
}

- (void)telephoneRowSelected {
    NSString *value = [self textForKey:@"telephone"];	
    [self makeCall:value];
}

- (void)directionsRowSelected {
    NSArray *addressDetails = [NSArray arrayWithObjects:[self.gp valueForKey:@"address1"], [self.gp valueForKey:@"postcode"], nil];
    NSString *addressString = [addressDetails componentsJoinedByString:@", "];
    
    NSString *locationString = [NSString stringWithFormat:@"%f, %f", self.location.coordinate.latitude, self.location.coordinate.longitude];

    RouteViewController *routeViewController = [[RouteViewController alloc] initWithNibName:@"RouteView" bundle:nil];
    [routeViewController setStartPoint:locationString];
    [routeViewController setEndPoint:addressString];
    
    UIBarButtonItem *backButton = [[UIBarButtonItem alloc] initWithTitle:@"Back" style:UIBarButtonItemStyleBordered target:nil action:nil]; 
    [[self navigationItem] setBackBarButtonItem:backButton];
    UINavigationController *navigationController = (RootViewController *)self.parentViewController;
    [navigationController pushViewController:routeViewController animated:YES];
}

# pragma IBActions

- (IBAction)phoneButtonPressed:(id)sender {
    [self telephoneRowSelected];
}
- (IBAction)directionsButtonSelected:(id)sender {
    [self directionsRowSelected];
}

/**
 * iOS5 only. This method is deprecated in iOS6.
 *
 * @see supportedInterfaceOrientations
 */
- (BOOL)shouldAutorotateToInterfaceOrientation:(UIInterfaceOrientation)toInterfaceOrientation
{
    return UIInterfaceOrientationIsPortrait(toInterfaceOrientation);
}

/**
 * iOS6 only.
 *
 * replaces shouldAutorotateToInterfaceOrientation:
 */
- (NSUInteger)supportedInterfaceOrientations
{
    return UIInterfaceOrientationMaskPortrait;
}

@end
