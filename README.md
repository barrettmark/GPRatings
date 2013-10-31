GPRatings
=========

This is the source code for GP Ratings - an app that transforms Open Data into understandable information that people can use to select the best healthcare provider in their local area

Full details available at http://barrettmark.com/gpratings (including a video of me explaining the app)

Data
=========

The app uses 42 million pieces of patient feedback, taken from Open Data published by the Health & Social Care Information Centre - http://bit.ly/1h2nT4R

Data Transformation
=========
The App transforms the data into star ratings using a simple calculation. 

Data usually comes in this format

"Would you recommend the GP surgery"

200 people said - No, would definitely not recommend
123 people said - No, would probably not recommend
321 people said - Not sure
543 people said - Yes, might recommend
432 people said - Yes, would definitely recommend
50 people said - Don't know

I then aggregate the data as follows

200 X 1 point = 200
123 x 2 points = 246
321 x 3 points = 693
543 x 4 points = 2172
432 x 5 points = 2160
50 x 0 points = 0 (ie discount this from calculation)

= 5471 points in total

THEN I compare this figure for each surgery in the country by splitting into Deciles. 

Deciles provide the star rating out of a maximum of 5 start (there are full stars and half stars)

This provides the data that is used for the app.

Why Open Source?
=========
There is a lot of potential to use this framework for other sectors - School Ratings, Hospital Ratings - anything where there is rich, Open Source Data. I believe I can add more value to the Open Data movement by releasing it as Creative Commons Open Source, and letting others use the framework for their own endevours. 

Let me know how you get on
=========
http://www.barrettmark.com
@m_barrett
It'd be nice to get a credit in your app if you use this source code 


