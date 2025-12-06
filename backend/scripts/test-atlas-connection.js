const mongoose = require('mongoose');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });

const testConnection = async () => {
    console.log('🔄 Testing MongoDB Atlas connection...');
    console.log(`📍 URI: ${process.env.MONGODB_URI?.split('@')[1] || 'Hidden (Check .env)'}`); // Hide credentials in logs

    if (!process.env.MONGODB_URI) {
        console.error('❌ MONGODB_URI is missing in .env file');
        return;
    }

    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('✅ Connection SUCCESSFUL!');
        console.log('🎉 You are successfully connected to MongoDB Atlas.');

        // Optional: List collections to verify read access
        const collections = await mongoose.connection.db.listCollections().toArray();
        console.log(`📚 Found ${collections.length} collections in the database.`);

    } catch (error) {
        console.error('❌ Connection FAILED:', error.message);
        console.log('\nPossible issues:');
        console.log('1. IP Address not whitelisted in Atlas (Network Access).');
        console.log('2. Incorrect username or password.');
        console.log('3. Database name missing in connection string.');
    } finally {
        await mongoose.connection.close();
        process.exit();
    }
};

testConnection();
