# Coordinator Tool API

Live app: https://zoeferencova-coordinator-tool.now.sh/

## Summary

As a client service coordinator, I found that there were many aspects of my job that were repetitive and inefficient. I would write the same email dozens of times in one day and keep track of all of my correspondence in a notebook where I had to rewrite my task list every day. I created the coordinator tool to address these pain points and automate as much of the job as possible.

The coordinator tool makes tracking reach-outs and organizing tasks extremely easy. The main list tab and completed tab can be used to track, change and revert the status of items as well as link to external sites for easy navigation. Users are able to create email templates for emails that are commonly sent which then template in values from the item list so that emails can be composed and populated with values for each list item in one click. The dashboard page keeps track of some key statistics that allow the user to keep track of request volume trends as well as other insightful stats and KPI's.

## API Documentation

### Authentication Endpoint

Endpoint for Authentication on user login.

* [Login](docs/login.md) : `POST /api/auth/login`

### User Data Endpoint

Endpoint used to retrieve all data (list item, PM, template, completed list item, and user information) associated with the User whose Token is provided with the request:

* [Get User Data](docs/user-data/get.md) : `GET /api/user-data`

### User Information Endpoints

Endpoints related to user information associated with the User whose Token is provided with the request:

* [Get User Info](docs/user/get.md) : `GET /api/users`
* [Create User](docs/user/post.md) : `POST /api/users`

### List Item Endpoints

Endpoints used to view and manipulate list item data associated with the User whose Token is provided with the request:

* [Get User's List Items](docs/items/get.md) : `GET /api/list`
* [Create List Item](docs/items/post.md) : `POST /api/list`
* [Get List Item by ID](docs/items/id/get.md) : `GET /api/list/:id`
* [Delete List Item by ID](docs/items/id/delete.md) : `DELETE /api/list/:id`
* [Update List Item by ID](docs/items/id/patch.md) : `PATCH /api/list/:id`

### PM Endpoints

Endpoints used to view and manipulate PM data associated with the User whose Token is provided with the request:

* [Get User's PMs](docs/pms/get.md) : `GET /api/pms`
* [Create PM](docs/pms/post.md) : `POST /api/pms`
* [Get PM by ID](docs/pms/id/get.md): `GET /api/pms/:id`
* [Delete PM By ID](docs/pms/id/delete.md): `DELETE /api/pms/:id`

### Template Endpoints

Endpoints used to view and manipulate template data associated with the User whose Token is provided with the request:

* [Get User's Templates](docs/templates/get.md) : `GET /api/templates`
* [Create Template](docs/templates/post.md) : `POST /api/templates`
* [Get Template by ID](docs/templates/id/get.md): `GET /api/templates/:id`
* [Delete Template By ID](docs/templates/id/delete.md): `DELETE /api/templates/:id`
* [Update Template by ID](docs/templates/id/patch.md) : `PATCH /api/templates/:id`

### Data Endpoints

Endpoints used to view quantitative data for the dashboard tab associated with the User whose Token is provided with the request:

* [Get PM Data](docs/data/pm-data.md) : `GET /api/data/pm-data`
* [Get Completed Timespan Data](docs/data/completed-timespan-data.md) : `GET /api/data/completed-timespan-data`
* [Get Created Timespan Data](docs/data/created-timespan-data.md) : `GET /api/data/created-timespan-data`
* [Get Time Completed Data](docs/data/time-completed-data.md) : `GET /api/data/time-completed-data`
* [Get Dashboard Data](docs/data/dashboard-data.md) : `GET /api/data/dashboard-data`

## Technologies Used

* Node.js with Express
* PostgreSQL with Knex
* JWT for authentication
* Mocha for testing

## Demo Account

To access the demo account, sign in using the below credentials:

Email: demoaccount@demo.com
Password: DemoPassword1!
