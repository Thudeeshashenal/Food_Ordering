# 🚀 Quick Start Guide - FoodHub

Get your online food ordering system up and running in just a few minutes!

## ⚡ Super Quick Setup (3 Steps)

### 1. Install Dependencies
```bash
npm install
```

### 2. Setup Database
```bash
npm run setup
```

### 3. Start the Server
```bash
npm start
```

**That's it!** 🎉 Open http://localhost:3000 in your browser.

---

## 📋 What You Get

✅ **Complete Food Ordering System** with:
- User registration & login
- Beautiful responsive design
- Menu browsing with categories
- Shopping cart functionality
- Table reservation system
- Contact form
- MySQL database integration

✅ **Modern UI Features**:
- Interactive colors and animations
- Mobile-responsive design
- Smooth scrolling navigation
- Modal dialogs
- Search functionality
- Real-time cart updates

✅ **Backend Features**:
- RESTful API endpoints
- Secure authentication
- Session management
- Database relationships
- Input validation

---

## 🎯 Test the System

1. **Register a new account**
2. **Browse the menu** - try different categories
3. **Add items to cart** - see the cart counter update
4. **Make a reservation** - pick a date and time
5. **Send a contact message**

---

## 🔧 Customization

### Change Colors
Edit `public/styles.css` and modify the CSS custom properties:
```css
:root {
    --primary-color: #667eea;
    --secondary-color: #764ba2;
    --accent-color: #ff6b6b;
}
```

### Add Menu Items
Connect to your MySQL database and insert new items:
```sql
INSERT INTO menu_items (name, description, price, category, image_url) 
VALUES ('Your Item', 'Description', 12.99, 'main', 'image_url');
```

### Modify Restaurant Info
Update the contact information in `public/index.html`:
- Restaurant name
- Address
- Phone number
- Email
- Hours

---

## 🆘 Troubleshooting

**Database Connection Issues?**
- Make sure MySQL is running
- Check credentials in `.env` file
- Run `npm run setup` again

**Port Already in Use?**
- Change PORT in `.env` file
- Or kill the process: `lsof -ti:3000 | xargs kill`

**Dependencies Missing?**
- Run `npm install` again
- Check Node.js version (v14+)

---

## 📱 Mobile Testing

The system is fully responsive! Test on:
- Mobile phones
- Tablets
- Different screen sizes

---

## 🎨 Design Highlights

- **Gradient backgrounds** for modern look
- **Smooth animations** and transitions
- **Interactive hover effects**
- **Professional color scheme**
- **Clean typography** with Google Fonts
- **Intuitive navigation**

---

## 🔐 Security Features

- Password hashing with bcrypt
- Session-based authentication
- SQL injection prevention
- CORS protection
- Input validation

---

## 📊 Database Schema

The system includes these tables:
- `users` - User accounts
- `menu_items` - Food items
- `cart` - Shopping cart
- `reservations` - Table bookings
- `orders` - Order history (ready for future use)
- `order_items` - Order details

---

## 🚀 Next Steps

1. **Customize** the design and content
2. **Add more menu items** to your database
3. **Configure** your restaurant details
4. **Deploy** to a hosting service
5. **Add payment integration** (future enhancement)

---

**Enjoy your new food ordering system! 🍽️**

For detailed documentation, see `README.md`
