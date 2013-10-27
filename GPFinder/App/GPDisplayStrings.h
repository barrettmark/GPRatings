//
//  GPDisplayStrings.h
//  GPFInder
//
//  Created by barrettmark.com on 01/05/2012.
//

#import <Foundation/Foundation.h>

@interface GPDisplayStrings : NSObject

/**
 * A dictionary containing the GP properties to displays strings mappings.
 * Used when outputting the contents of the GP ratings to view.
 */
@property (readonly, nonatomic) NSDictionary *displayStringMappings;

@end
