# Periodic Tables Reservation System 
A restaurant reservation system used to keep track of guest reservations and table assignments.

> Live application: https://pngeeves-pt-front-end.herokuapp.com/dashboard

## Technologies
- HTML
- CSS
- JavaScript
- React
- Express
- Knex
- PostgreSQL API

## Installation 
1. Fork and clone this repository.
2. Run `cp ./back-end/.env.sample ./back-end/.env`.
3. Update the `./back-end/.env` file with the connection URL's to your database instance.
4. Run cp `./front-end/.env.sample ./front-end/.env`.
5. Include your backend connection within `./front-end/.env` (defaults to `http://localhost:5000`).
6. Run `npm install` to install project dependencies.
7. Run `npm run start` to start the server.

## Features 
![dashboard](/final-screen-shots/dashboard.png)
### Creating a reservation 

1. Click on `New Reservation` on the navigation bar
2. Fill out all information on the form 
3. After `submit` you will be redirected to dashboard on the date of your newly created reservation
</br>

![dashboard](/final-screen-shots/resKey.png)
![dashboard](/final-screen-shots/reservation.png)
![dashboard](/final-screen-shots/createDash.png)

### Search for reservation 

1. Click on `Search` on the navigation bar
2. Input the phone number of the reservation you want to find 
3. A card containing the information of the reservation will be pulled up 
- If there is no reservation matching the phone number then an error banner with show
</br>

![dashboard](/final-screen-shots/searchKey.png)
![dashboard](/final-screen-shots/search.png)

### Create a new table  

1. Click on `New Table` on the navigation bar
2. Input the desired name and capacity of your new table
3. Your new table will show on the lower half of the dashboard screen 
</br>

![dashboard](/final-screen-shots/tableKey.png)
![dashboard](/final-screen-shots/table.png)

### Assign reservation to a table  

1. Click the `Seat` button on the reservation you wish to assign  
2. Pick a table from the dropdown menu (each option states the table name and table capacity)
3. The table will now show as occupied on the dashboard
</br>

![dashboard](/final-screen-shots/customer.png)
![dashboard](/final-screen-shots/customerSeat.png)
![dashboard](/final-screen-shots/occupied.png)
