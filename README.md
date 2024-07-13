# 🚈 RAILSYNC - Railway Management System 

RAILSYNC is a web-based railway management system that offers efficient railway ticket booking solutions with integrated database management. The website has a minimalistic, dark-themed design and is built to be scalable and robust.

## ✨ Features

- **User Authentication**: Users can sign up, log in, and manage their accounts securely.
- **Ticket Booking**: Users can search for trains, view schedules, and book tickets.
- **Admin Panel**: Administrators have access to manage trains, stations, schedules, and user data.
- **Database Integration**: Utilizes a Microsoft SQL Server database to store and retrieve train, station, schedule, and user information.
- **Responsive Design**: The website is designed to be accessible and usable across different devices and screen sizes.
- **Sessions**: Sessions are implemented for user and admin authentication. You can check the session status by:
  - `/sessionCheckUser`
  - `/sessionCheckAdmin`
- **Database Status**: Database status routes are also implemented to reconnect or check the connection with the database hosted on cloud.
  - `/checkDatabaseConnection`
  - `/connectDatabase`

- **Working Contact Form**: The users can send their query and it will be recieved on your gmail after configuring nodemail object by simply entering `your-email` and `16-digit AppPass` 

## 🛠 Technologies Used

- **Frontend**: HTML, CSS, JavaScript, Bootstrap
- **Backend**: EXPRESS.JS AND NODE.JS
- **Database**: Microsoft SQL Server
- **Authentication**: JS
- **Production**: local host
- **Deployment**: AZURE

## 📜 License

The code in this repository is licensed under the MIT License. 

MIT License

Copyright (c)  2024 | maazkhan75

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

## 📦 Installation


1. Clone the repository:

```bash
git clone https://github.com/maazkhan75/RailSync.git
```
2. First you should setup your database from the backup `RailSync_DB_backup.bak` file provided in the SQL directory of repo.

3. Plug your credentials in the .env file.

4. Run the server and visit `localhost:4000`.

## 🧪 Testing Guide

To test the website, follow these steps:

1. Ensure that you have all necessary dependencies installed.
2. Start the server and navigate to the website in your browser.
3. Use the following test credentials to log in:

   - **User**
     - CNIC: `3520297089087`
     - Password: `mypass123`

   - **Admin**
     - CNIC: `3520297089087`
     - Pin: `6776`

4. Test the following functionalities:
   - User signup, login, and session persistence.
   - Admin login and management of trains, stations, routes, and user data.
   - Train search and ticket booking.
   - Check the session status using the following endpoints:
     `/sessionCheckUser`
     `/sessionCheckAdmin`
   - If you are not sure about database connection you can check through:
     `/checkDatabaseConnection`
   - If due to any reason database connection is lost you can reconnect using:
     `/connectDatabase`

   
5. Test Case
  - **SEARCH TRAIN FROM `LHR TO ISL` ON `14 JUNE 2024`**
     - `LHR -> ISL`  4pm-11pm   (train without stop)
     - `LHR -> MLN` 4pm-7pm and `MLN -> ISL` 7:45-11:30pm   (train with stop)

6. Important Note
  - **You cannot change or update profile or password of Default User(maaz khan) even you cannot `delete or edit` default user and admin from admin panel.**

  - **The final attributes of the database tables may be `slightly different` from the attributes of entities in `SCHEMA.pdf` So you should always see tables definition in `SQL Server`**

  - **(If you want to travel from station A to B)**
     - you should have stations `A & B`
     - you should have track between `A & B`
     - you should have a train
     - you should have carriage/s in it
     - you should have a route defined from `A -> B` on your trip Data

      
## 📸 Screenshots of RailSync

### Home Page
![](screenShots/1.png)

### Decision Page
![](screenShots/2.png)

### User Login Form
![](screenShots/3.png)

### User Signup Form
![](screenShots/4.png)

### Password Reset Form
![](screenShots/5.png)

### Admin Login Form
![](screenShots/6.png)

### Admin Signup Form
![](screenShots/7.png)

### User Dashboard
![](screenShots/8.png)

### Profile
![](screenShots/9.png)

### Update Profile
![](screenShots/10.png)

### Password Change
![](screenShots/11.png)

### FAQ's
![](screenShots/12.png)

### Contact 
![](screenShots/13.png)

### Trip Form
![](screenShots/14.png)

### Available Trains
![](screenShots/15.png)

### Ticket
![](screenShots/16.png)

### My Bookings
![](screenShots/17.png)

### Admin Dashboard
![](screenShots/18.png)

### Stations and Tracks Data
![](screenShots/19.png)

### Users and Admins Data
![](screenShots/20.png)

### Crew Data
![](screenShots/21.png)

### Trains Data
![](screenShots/22.png)

### Routes Data
![](screenShots/23.png)

### Add Data
![](screenShots/24.png)
![](screenShots/25.png)
![](screenShots/26.png)
![](screenShots/27.png)
![](screenShots/28.png)
![](screenShots/29.png)

### Edit Data
![](screenShots/30.png)
![](screenShots/31.png)
![](screenShots/32.png)
![](screenShots/33.png)
![](screenShots/34.png)
![](screenShots/35.png)
![](screenShots/36.png)
![](screenShots/37.png)
![](screenShots/38.png)

























