# Shopping Website

Version: 1.0

## Key Features

### Admin Panel

- Dashboard Overview:
  - View totals for:
  - Orders
  - Users
  - Contact us submissions
  - NewsLetter subcribers
  - Sent newsletters
  - Products, product categories, colors and sizes
- Product Management:
  - Add, edit and delete products
  - Attach specific sizes to product categories for better customization
- Category and Attribute Management:
  - Create and manage product categories
  - Add and manage color options
  - Add and manage size options, with category specific associations
- User Data Management:
  - View registered user details and basic profile information
- Homepage Slideshow Management:
  - Create and manage homepage slideshow banners
- Contact Submissions Management:
  - View submissions from the "Contact Us" form
- Newsletter System:
  - Create, manage and send newsletters using SendGrid integration
  - view and manage the list of newsletter subscribers

### Frontend Website

- Homepage:
  - Display featured products, including:
  - Slideshow with promotional banners
  - Newest products section
  - Most popular products section
  - Search functionality for finding specific products
  - Option for visitors to subscribe to the newsletter
- Products page:
  - Displays all products
  - Available filter options:
    - Availability
    - Price slider
    - Category
    - Gender
    - Color
    - Size
    - Sort by price
- User Profile and Cart:
  - Profile page for users to view their basic information
  - Shopping cart functionality for managing selected items before checkout

## Technologies Used

- Next.js
- Better-sqlite3
- SendGrid
- NodeMailer
- Tailwind

## Installation and setup

Clone the repository:

```
git clone https://github.com/Edga380/shopping-website.git
```

## Navigate to the project directory:

```
cd shopping-website
```

## Install dependencies:

```
npm install
```

## Create and fill in .env file:

```
There is .env.example file available for reference.
```

## Install seed data:

```
node database/seedData/seedData.js
```

## Run application:

```
npm run dev
```

## Open application on your browser:

```
http://localhost:3000
```

## Accessing "Admin panel":

```
http://localhost:3000/admin
```
