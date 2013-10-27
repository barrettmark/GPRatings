//
//  AboutViewController.h
//  GPFInder
//
//  Created by barrettmark.com on 21/04/2012.
//

#import <UIKit/UIKit.h>

@interface AboutViewController : UIViewController <UIWebViewDelegate>

@property (retain, nonatomic) IBOutlet UIWebView *webView;

/**
 * Action called when the close button is pressed
 */
- (IBAction)close:(id)sender;

/**
 * Fetch and return the HTML copy from the application bundle
 */
- (NSString *)html;

@end
