Sam's Fitness - A Full-Stack Gym Management System
Welcome to the official repository for the Sam's Fitness Gym Management System. This is a comprehensive, full-stack web application designed for a final year B.Sc. Computer Science project. It provides a modern, digital solution for managing a fitness center's clients, subscriptions, and feedback, replacing traditional manual methods with an efficient and user-friendly platform.

✨ Features
The application is split into two main roles: Client and Admin, with a rich set of features for each.

👩‍💻 For Clients & Visitors
Interactive Goal Selector: A pop-up modal on the homepage that guides new visitors to a recommended membership plan based on their fitness goals.

Dynamic Plan Display: The "Our Plans" section on the homepage is dynamically populated from the database, showing the specific services included with each plan.

BMI Calculator: An interactive tool on the homepage for visitors to calculate their Body Mass Index.

Secure User Registration: A streamlined registration process where users can sign up for a specific plan (including a "Free Trial").

Secure User Login: A token-based (JWT) authentication system to ensure secure access.

Protected Client Dashboard: A personal dashboard for logged-in members to view their profile information, subscription status (active/expired), plan name, and a detailed list of their included services.

Review Submission: A contact form on the homepage that allows any visitor to submit feedback or reviews.

👨‍💼 For Admins
Secure Admin Login: Admins have a separate, protected login flow.

Protected Admin Dashboard: A comprehensive dashboard that provides an at-a-glance overview of the gym's operations.

Live Analytics: Dynamic stat cards at the top of the dashboard showing Total Members, Active Subscriptions, and Total Reviews.

Complete Client Management:

View a list of all registered clients.

See each client's subscription plan, status, and membership start date.

Hover over a client's plan to see a custom tooltip with a detailed list of their included services.

Delete clients from the system.

Review Management: View a complete list of all user-submitted reviews in a dedicated table.

🛠️ Technology Stack
This project is a modern full-stack application built with a clear separation between the frontend and backend.

Frontend:

HTML5

CSS3

JavaScript (ES6+) for all client-side logic, including form handling, API calls with fetch, and dynamic content rendering.

Backend:

Node.js: The JavaScript runtime environment for the server.

Express.js: A fast and minimalist web framework for building the RESTful API.

MySQL: The relational database used to store all application data.

bcrypt.js: For securely hashing user passwords.

jsonwebtoken (JWT): For creating and verifying secure authentication tokens.

Development Environment:

XAMPP: Used to run the local Apache and MySQL servers.

Visual Studio Code: As the primary code editor.

Thunder Client: For API endpoint testing during development.

🚀 Setup and Installation Guide
To get the project running locally, follow these steps.

Prerequisites
Node.js and npm: Make sure you have Node.js installed on your system. You can download it from nodejs.org.

XAMPP: A local server environment to run the MySQL database. Download it from apachefriends.org.

1. Database Setup
Start XAMPP: Open the XAMPP Control Panel and start both the Apache and MySQL modules.

Open phpMyAdmin: Go to http://localhost/phpmyadmin in your browser.

Create the Database: Click on the "Databases" tab and create a new database named exactly gym_db.

Create Tables and Populate Data:

Click on your new gym_db in the sidebar to select it.

Go to the "SQL" tab.

Copy the entire SQL code from the database_setup.sql file in this project and paste it into the query box.

Click "Go" to execute the script. This will create all the necessary tables and populate them with initial data (plans, services, etc.).

2. Backend Setup
Navigate to the Backend Folder: Open a terminal and navigate to the backend directory of the project.

cd path/to/your/GYM PROJECT/backend

Install Dependencies: Run the following command to install all the necessary Node.js packages.

npm install

Start the Backend Server: Once the installation is complete, start the server.

node server.js

You should see the confirmation messages in your terminal: Server running on port 5000 and MySQL Connected.... Your backend is now running.

3. Frontend Setup
No installation is needed for the frontend.

Simply open the frontend/index.html file in your web browser to start using the application. You can also use a live server extension in VS Code for a better development experience.

📄 API Endpoints
The backend provides the following RESTful API endpoints:

Method

Endpoint

Description

Protected

POST

/api/auth/register

Registers a new user and creates a subscription.

No

POST

/api/auth/login

Authenticates a user and returns a JWT.

No

GET

/api/plans

Gets a list of all plans and their included services.

No

POST

/api/contact

Submits a review from the contact form.

No

GET

/api/user/profile

Gets the profile and subscription details of the logged-in user.

Yes (Client)

GET

/api/admin/stats

Gets the dashboard statistics (total members, etc.).

Yes (Admin)

GET

/api/admin/clients

Gets a list of all clients and their details.

Yes (Admin)

DELETE

/api/admin/clients/:id

Deletes a specific client from the database.

Yes (Admin)

GET

/api/admin/reviews

Gets a list of all submitted reviews.

Yes (Admin)

🖼️ Screenshots
The interactive "What's Your Goal?" pop-up on the homepage.

The complete Admin Dashboard, showing live stats, the client list, and the review table.

The enhanced Client Dashboard, showing the user's personal subscription details and included services.