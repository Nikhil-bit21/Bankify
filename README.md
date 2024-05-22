# Bankify Application

This is a backend application for a Banking system where users can make transaction through UPI and Cash both Can Deposit money in bank . It provides functionalities for user authentication, User Management, and Transaction History.

## Features

- User sign up and login with mobile and password
- User can view the his/her account details 
- User can deposit or make a transaction to another account also 
- Admin can manage all the user and their accounts
- Currently there is only one admin

## Technologies Used

- Node.js
- Express.js
- MongoDB
- JSON Web Tokens (JWT) for authentication

## Installation

1. Clone the repository:

   ```bash
   https://github.com/Nikhil-bit21/Bankify


# API Endpoints

## Authentication

### Sign Up
-  There is no signup route user need to make his account by going to admin

### Login
- `POST /bank`: Login a user/admin

## Admin

### Get info about all Users
- `GET /bank/admin`: Get the All the Users

### Get info About a user
- `GET /bank/admin/:id`: Get the info about specific user

### Add User
- `POST /bank/admin`: Add a new User (Admin only)

## User

### Payment to another account through UPI
- `POST /bank/user/payment/upi`: Make the payment to the another account in this bank

### Withdrawal of cash 
- `POST /bank/user/payment/cash`: Make the payment for Cash Withdrawal

### Get info about his/her account
- `GET /bank/user`: Get the info his/her account

### Add Money
- `POST /bank/user/deposit`: Can Deposit money in his/her account (User Only);



