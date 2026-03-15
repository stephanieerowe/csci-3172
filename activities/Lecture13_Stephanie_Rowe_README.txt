L14 Activity

This assessment evaluates the perceivability of selected pages on the WIRED website. Perceivable content means that information and user interface components must be presented in ways that users can detect through sight, hearing, or assistive technologies such as screen readers.


Date Created: 08 03 2026
Last Modification Date: 08 03 2026


Authors

Stephanie Rowe - serowe@dal.ca - Developer



Pages Analyzed:
Homepage
Security page
"The Big Story" page

WCAG Principle evaluated: Perceivable



Issue 1 – Non-Text Content May Lack Descriptive Alternatives (Homepage, security page, "The Big Story" page)

WCAG 2.2 – Success Criterion 1.1.1: Non-text Content (Level A)

Issue Identified - Some images on the homepage contain automatically generated alt text that is vague or inaccurate. For example, the featured article image includes alt text such as "Image may contain Lighting Plane Vehicle and Map"

This description appears to be generated automatically and does not accurately convey the purpose of the image. The image is primarily a graphic of a missile defense vehicle with a plane in the background, used to represent the article about missile interception in the Gulf region.

Because the alt text is generic and uncertain (“may contain”), it does not provide meaningful information for screen reader users.

Recommendations
Replace automatically generated alt text with purposeful, descriptive alt text written by the content author.
Ensure the alt text describes the meaning of the image in the context of the article, rather than listing possible objects detected by AI.
Avoid uncertain language such as “may contain”.



Issue 2 – Dense Content May Reduce Readability (Homepage, security page, "The Big Story" page)

WCAG 2.2 – Success Criterion 1.4.8: Visual Presentation (Level AAA)


Issue Identified - The homepage, security page, and "The Big Story" page contain a high density of article previews and headlines, particularly in multi-column sections. While visually appealing, this layout may make it harder for users with cognitive disabilities or low vision to quickly distinguish between articles.

This does not represent a violation of WCAG Level A or AA requirements, but improving readability could enhance accessibility for some users.

Recommendations
Increase spacing between article cards in dense sections.
Consider slightly larger text for article summaries.
Maintain clear visual separation between content groups.

Possible improvements:
larger line spacing
increased padding between cards
clearer section dividers



Issue 3 – Autoplay Video Visibility (Homepage)

WCAG 2.2 – Guideline 1.2: Time-Based Media

Issue Identified - The homepage contains embedded video content within article previews. If videos include autoplay or motion, users with visual or cognitive disabilities may find them distracting or difficult to interpret without clear controls or captions.


Recommendations
Ensure videos include:
	- captions
	- pause/play controls
	- no autoplay by default (if possible)
Ensure the video player clearly indicates that media content is present.




Estimated Level of Conformance

Based on the evaluation of the selected pages, the WIRED website appears to meet most Level A perceivability requirements. 
Some minor improvements related to descriptive alt text and content readability could further improve accessibility. 
Overall, the site appears to approach WCAG Level AA compliance for the Perceivable principle, though further automated and manual testing would be required for full confirmation.




Acknowledgements:

CSCI 3172 course material
WCAG Accessibility Guidelines - https://www.w3.org/TR/2024/REC-WCAG22-20241212/#perceivable