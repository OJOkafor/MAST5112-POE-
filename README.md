"# MAST5112-POE-FINAL" 

Changelog for Chef App

Features Implemented:

Menu Item Entry

The app allows the chef to enter menu item details:
Dish Name
Description
Select Course (from predefined list)
Price
Predefined Course List

The app provides a predefined list of courses for the chef to choose from when adding menu items, including starters, mains, and desserts.
Home Screen Menu Display

The home screen displays the complete menu that the chef has prepared.
Total Number of Menu Items

The home screen shows the total number of menu items available for selection.
Average Price by Course

The home screen displays the average price of menu items broken down by different courses.
Separate Add Menu Items Screen

Added a separate screen for adding menu items, moved from the home screen to this new screen as per PoE final requirements.
Adding and Removing Items from List

On the newly created add menu items screen, the chef can add new dishes to the menu list and remove any existing dishes.
The home screen continues to show the complete menu updated dynamically.
Menu Data Management

Menu items are stored in an array in the app state.
Adding and removing menu items updates this array accordingly.
Guest Filter Screen

A separate page/screen allows guests to filter the displayed menu by course; for example, guests can filter to see only starters.
