const mysql = require('mysql2');
const fs = require('fs');
const path = require('path');

// Database configuration
const dbConfig = {
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    multipleStatements: true
};

console.log('🍽️  FoodHub Setup Script');
console.log('========================\n');

// Check if .env file exists
if (!fs.existsSync('.env')) {
    console.log('📝 Creating .env file...');
    const envContent = `DB_HOST=localhost
DB_USER=root
DB_PASSWORD=
DB_NAME=food_ordering_system
PORT=3000`;
    
    fs.writeFileSync('.env', envContent);
    console.log('✅ .env file created successfully!\n');
} else {
    console.log('✅ .env file already exists\n');
}

// Setup database
async function setupDatabase() {
    const connection = mysql.createConnection(dbConfig);
    
    try {
        console.log('🔌 Connecting to MySQL...');
        
        // Read and execute SQL file
        const sqlContent = fs.readFileSync('database.sql', 'utf8');
        
        console.log('📊 Creating database and tables...');
        await connection.promise().execute(sqlContent);
        
        console.log('✅ Database setup completed successfully!');
        console.log('📋 Created tables: users, menu_items, cart, reservations, orders, order_items');
        console.log('🍕 Added sample menu items with categories');
        
    } catch (error) {
        console.error('❌ Database setup failed:', error.message);
        console.log('\n💡 Troubleshooting tips:');
        console.log('1. Make sure MySQL is running');
        console.log('2. Check your database credentials in .env file');
        console.log('3. Ensure you have permission to create databases');
        console.log('4. Try running the SQL commands manually from database.sql');
    } finally {
        connection.end();
    }
}

// Check if dependencies are installed
function checkDependencies() {
    console.log('📦 Checking dependencies...');
    
    if (!fs.existsSync('node_modules')) {
        console.log('❌ Dependencies not installed. Please run: npm install');
        return false;
    }
    
    console.log('✅ Dependencies are installed');
    return true;
}

// Main setup function
async function main() {
    console.log('🚀 Starting FoodHub setup...\n');
    
    // Check dependencies
    if (!checkDependencies()) {
        console.log('\n❌ Setup incomplete. Please install dependencies first.');
        process.exit(1);
    }
    
    // Setup database
    await setupDatabase();
    
    console.log('\n🎉 Setup completed successfully!');
    console.log('\n📋 Next steps:');
    console.log('1. Update database credentials in .env file if needed');
    console.log('2. Run: npm start (or npm run dev for development)');
    console.log('3. Open: http://localhost:3000');
    console.log('\n🍽️  Enjoy your FoodHub system!');
}

// Run setup
main().catch(console.error);
