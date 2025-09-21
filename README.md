# FoodHub - Online Food Ordering System

A comprehensive web-based food ordering system with user registration, menu browsing, cart functionality, reservations, and contact features. Built with HTML, CSS, JavaScript frontend and Node.js/Express backend with MySQL database.

## Features

### Frontend Features
- **Responsive Design**: Modern, mobile-friendly interface with interactive colors
- **User Authentication**: Registration and login system with session management
- **Menu System**: Browse food items by categories (Breakfast, Main Course, Dessert, Beverages)
- **Search Functionality**: Search menu items by name, description, or category
- **Shopping Cart**: Add/remove items, update quantities, view total
- **Reservation System**: Make table reservations with date, time, and guest count
- **Contact Form**: Send messages to the restaurant
- **Interactive UI**: Smooth animations, hover effects, and modern design

### Backend Features
- **RESTful API**: Complete API endpoints for all functionality
- **User Management**: Secure registration and authentication with bcrypt
- **Session Management**: Express sessions for user state
- **Database Integration**: MySQL database with proper relationships
- **Cart Management**: Persistent cart functionality
- **Reservation System**: Store and manage reservations
- **Security**: Password hashing, input validation, CORS protection

## Technology Stack

### Frontend
- HTML5
- CSS3 (with Flexbox and Grid)
- JavaScript (ES6+)
- Font Awesome Icons
- Google Fonts (Poppins)

### Backend
- Node.js
- Express.js
- MySQL2
- bcryptjs (password hashing)
- express-session (session management)
- CORS (cross-origin requests)
- body-parser (request parsing)

## Installation & Setup

### Prerequisites
- Node.js (v14 or higher)
- MySQL (v5.7 or higher)
- npm or yarn

### Step 1: Clone/Download the Project
```bash
# If using git
git clone <repository-url>
cd food-ordering-system

# Or download and extract the ZIP file
```

### Step 2: Install Dependencies
```bash
npm install
```

### Step 3: Database Setup
1. Open MySQL command line or phpMyAdmin
2. Run the SQL commands from `database.sql`:
```sql
-- This will create the database and all required tables
-- with sample menu data
```

### Step 4: Environment Configuration
Create a `.env` file in the root directory:
```env
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_mysql_password
DB_NAME=food_ordering_system
PORT=3000
```

### Step 5: Start the Application
```bash
# Development mode with auto-restart
npm run dev

# Or production mode
npm start
```

### Step 6: Access the Application
Open your browser and navigate to:
```
http://localhost:3000
```

## Project Structure

```
food-ordering-system/
├── public/
│   ├── index.html          # Main HTML file
│   ├── styles.css          # CSS styles
│   └── script.js           # JavaScript functionality
├── server.js               # Express server
├── package.json            # Node.js dependencies
├── database.sql            # Database schema and sample data
└── README.md              # This file
```

## API Endpoints

### Authentication
- `POST /api/register` - User registration
- `POST /api/login` - User login
- `POST /api/logout` - User logout
- `GET /api/auth/status` - Check authentication status

### Menu
- `GET /api/menu` - Get all menu items
- `GET /api/menu/category/:category` - Get items by category

### Cart
- `POST /api/cart/add` - Add item to cart
- `GET /api/cart` - Get user's cart items
- `DELETE /api/cart/:itemId` - Remove item from cart

### Reservations
- `POST /api/reservation` - Create reservation
- `GET /api/reservations` - Get user's reservations

## Database Schema

### Tables
1. **users** - User accounts and authentication
2. **menu_items** - Food items with categories and pricing
3. **cart** - Shopping cart items for each user
4. **reservations** - Table reservations
5. **orders** - Order history (for future implementation)
6. **order_items** - Individual items in orders

## Usage Guide

### For Users
1. **Registration**: Create an account with username, email, password, and phone
2. **Login**: Access your account to use cart and reservation features
3. **Browse Menu**: View food items by category or search for specific items
4. **Add to Cart**: Click "Add to Cart" on any menu item
5. **Manage Cart**: View cart, update quantities, or remove items
6. **Make Reservation**: Select date, time, and number of guests
7. **Contact**: Send messages to the restaurant

### For Developers
- The frontend communicates with the backend via RESTful APIs
- All user data is stored in MySQL database
- Sessions are managed server-side for security
- The application is fully responsive and works on all devices

## Customization

### Adding New Menu Items
1. Access your MySQL database
2. Insert new records into the `menu_items` table:
```sql
INSERT INTO menu_items (name, description, price, category, image_url) 
VALUES ('New Item', 'Description', 15.99, 'main', 'image_url');
```

### Modifying Styles
- Edit `public/styles.css` to change colors, fonts, or layout
- The design uses CSS custom properties for easy color theming
- Responsive breakpoints are defined for mobile optimization

### Adding New Features
- Backend: Add new routes in `server.js`
- Frontend: Add new functions in `public/script.js`
- Database: Create new tables as needed

## Security Features

- Password hashing with bcrypt
- Session-based authentication
- CORS protection
- Input validation
- SQL injection prevention with prepared statements

## Browser Support

- Chrome (recommended)
- Firefox
- Safari
- Edge
- Mobile browsers (iOS Safari, Chrome Mobile)

## Troubleshooting

### Common Issues

1. **Database Connection Error**
   - Check MySQL is running
   - Verify credentials in `.env` file
   - Ensure database exists

2. **Port Already in Use**
   - Change PORT in `.env` file
   - Kill existing process on port 3000

3. **Module Not Found**
   - Run `npm install` to install dependencies
   - Check Node.js version compatibility

4. **CORS Errors**
   - Ensure frontend and backend are on same domain/port
   - Check CORS configuration in server.js

## Future Enhancements

- Order management system
- Payment integration
- Admin dashboard
- Real-time notifications
- Email notifications
- Order tracking
- Reviews and ratings
- Loyalty program

## License

This project is open source and available under the MIT License.

## Support

For support or questions, please contact the development team or create an issue in the project repository.

---

**Enjoy your food ordering system! 🍽️**
