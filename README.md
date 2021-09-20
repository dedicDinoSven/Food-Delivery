# Food Delivery
 Web application for food ordering.
 App is built with Node.js (Express framework), MongoDB for backend and EJS, jQuery, Bootstrap 5 for frontend. It has 5 modules:
 
## Main module
- Creating accounts (user can choose if he wants to register as customer or courier)
- Login for all user types

## Super administrator
-  CRUD operations for lookup collections (restaurant types, menu types, payment types, order statuses)
-  CRUD operations for restaurants
-  Registering restaurant administrators
-  Overview of data for all restaurants
-  Chat with restaurant administators

## Restaurant administrator
- CRUD operations for single products
- CRUD operations for special offers
- Order approvement and their auto assigment to couriers (based on air distance courier - restaurant)
- Updating restaurant data
- Chat with super administrator
- Real time notifications when new order is received and when courier delivers order
- Email report (number of orders for every day in that month and for whole month)
- 
## Courier
- Review of all orders which need to be delivered today (table and map)
- Different markers on map for orders which are delivered and for those which are not delivered
- Sending information to restaurant admin when order is delivered successfully
- One courier can work for multiple restaurants

## Customer
- After successful registration and login user selects his location (geocoding and reverse geocoding)
- Search by product name and product type
- User can only see restaurants that are delivering in his area
- Overview of all products and special offers
- Ordering functionality (if desired time of order is not specified it will be delivered after one hour)
- Email when order is received and saved to database
- Review of all previous orders
- Rating of service after order is delivered
 

