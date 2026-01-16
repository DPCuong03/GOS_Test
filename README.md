1. Backend Configuration (Laravel)
Navigate to the backend directory via your terminal:

```cd backend```


Install PHP dependencies:

```composer install```

Generate application key:

```php artisan key:generate```

Note: Use laragon or xampp to run mysql before create data

Run Migrations and Seed Data:

```php artisan migrate:fresh --seed```

Start the Backend server:

```php artisan serve```

Default URL: http://127.0.0.1:8000

2. Frontend Configuration (React)
Open a new terminal and navigate to the frontend directory:

```cd frontend``` 

Install JavaScript dependencies:

```npm install```

Start the Development server:

```npm run dev```

Default URL: http://localhost:5173
