//
//  AboutViewController.m
//  GPFInder
//
//  Created by barrettmark.com on 21/04/2012.
//

#import "AboutViewController.h"

@implementation AboutViewController

@synthesize webView;

- (void)viewDidLoad
{
    [super viewDidLoad];
    
    [self.webView setDelegate:self];
    
    // Load copy into webview.
    [self.webView loadHTMLString:[self html] baseURL:[NSURL URLWithString:@""]];
}

- (NSString *)html {
    NSError *error = nil;
    NSString *filePath = [[NSBundle mainBundle] pathForResource:@"about" ofType:@"html"];  
    return [NSString stringWithContentsOfFile:filePath encoding:NSASCIIStringEncoding error:&error];
}

- (IBAction)close:(id)sender {
    [self dismissModalViewControllerAnimated:YES];
}

# pragma UIWebViewDelegate methods

// Open any hrefs in Safari
-(BOOL)webView:(UIWebView *)webView shouldStartLoadWithRequest:(NSURLRequest *)request navigationType:(UIWebViewNavigationType)navigationType {
    if (navigationType == UIWebViewNavigationTypeLinkClicked) {
        [[UIApplication sharedApplication] openURL:[request URL]];
        return NO;
    }
    return YES;
}

@end
