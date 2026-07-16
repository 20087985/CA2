Student Name: Basima Salim
Student Number: 20087985
Module Lecturer: Paul Laird
Programme: Master of Science in Information Systems with Computing
Module/Subject Title: B9IS123 - PROGRAMMING FOR INFORMATION SYSTEMS
Assignment Title: Bread 41 Expiry & Batch Tracker (Assessment 2)
Submission Date:* July 13, 2026


BREAD 41 EXPIRY & BATCH TRACKER: 
Website for managing inventory for Braed 41 Bakery. Aims for the sustainable and zero waste operation of the bakery. This application tracks the production, shelf-life, and disposal of fresh daily sourdough bakes, pastries, and kitchen ferments.

Live Application URL: `http://34.105.141.153/`
Live API URL: `http://34.105.141.153:8000/api`

PROJECT INTRODUCTION & OVERVIEW:
Bread 41 produces organic bread and other items with short, natural shelf lives. Managing active batches and monitoring expired products on the production floor is really important for the smooth operation.

SYSTEM FUNCTIONALITIES:
Staff login and create new user. 
Adding new Batches of items
Displaying the items along with the number of days to expire in the table.
The table display alerting the staff on items which are soon to expire.
Delete option to remove the items from the teble. 
Filter option is also implemented to search for items in the table.
The expired items will be automatically moved to the expired items table. 
Analytics tab showing the count of the active and expired items.

PROJECT CORE FILES AND STACK USED:
Frontend : Html and Javascript. 
All the html contents of this project is writen on the index.html file and the javascript code can be seen on the app.js file. 
Backend: Python.
Backend logic is implemented in the server.py file. Have POST, UPDATE GET and DELETE APIS.
Database: JSON file.
deply.yml:  Automates testing and VM deployment upon every git commit.


HoW TO INSTALL AND RUN LOCALLY:
Clone the repository.
Navigate to backend directory and run the backend server locally using Python: python3 server.py.
To see the frontend open the browser and ope the index.html

REFERENCES:
HTML Forms and JavaScript Web APIs. Available at: [https://www.w3schools.com/html/][https://www.w3schools.com/html/] and [https://www.w3schools.com/js/][https://www.w3schools.com/js/]

Mozilla Developer Network (MDN) Web Docs (2026). DOM Event Architecture and Fetch API. Available at: [https://developer.mozilla.org/en-US/][https://developer.mozilla.org/en-US/].


Python Software Foundation (2026). Unittest — Unit testing framework. Python 3.10 Documentation. Available at: [https://docs.python.org/3/library/unittest.html],[https://docs.python.org/3/library/unittest.html].

Google Cloud Platform (2026). Compute Engine VM Instance & VPC Firewall Documentation. Available at: [https://cloud.google.com/docs],[https://cloud.google.com/docs].


AI CONTRIBUTIONS:
Authentication and UI layout : Referenced W3 school for baseline HTML login forms. Used Gemini to solve errors in javascript authentication. 
CSS Styling: Took help from gemini for CSS of tables, grids and views.
Backend Implementation: Took help from setting up backend server and pot setup.  
Backend Delete handler : There were some issues with the delete API. Gemini helped to fix the issues with that. 
Gemini assisted in identifying issues in callback fetch operations. 
CI/CD Configuration: Refered github documentations and also took help from gemini to setup the deploy.yml file to configure the deployment and fixing the deployment issues. 
Testcase: Refered the python documentation on unit test along with that took help from gemini to write the testcases. 




DECLARATION OF ACADEMIC INTEGRITY

By submitting this assignment, I am confirming that:
This assignment is entirely my own work;
Any external sources or documentation used have been explicitly referenced;
I have followed the Generative AI guidelines set out in the Assignment Brief under Level 4 (AI Task Completion, Human Evaluation);
I have read and understood the College rules regarding academic integrity in 
the QAH Part B Section 3, and understand that standard matching checks (such as Ouriginal/Turnitin) are applied to verify originality.

Signed: Basima Salim
Date: July 13, 2026





