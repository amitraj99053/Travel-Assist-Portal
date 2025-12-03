const mongoose = require('mongoose');
const Mechanic = require('../backend/src/models/Mechanic');
const User = require('../backend/src/models/User');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../backend/.env') });

const initializeDatabase = async () => {
    try {
        // Connect to MongoDB
        await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/travel-assist-portal');
        console.log('✅ Connected to MongoDB');

        // Create geospatial index on Mechanic location
        await Mechanic.collection.createIndex({ location: '2dsphere' });
        console.log('✅ Created 2dsphere index on Mechanic.location');

        // Check if we need to add sample mechanics
        const mechanicCount = await Mechanic.countDocuments();

        if (mechanicCount === 0) {
            console.log('📝 No mechanics found. Creating sample mechanics...');

            // Create sample users for mechanics
            const sampleMechanics = [
                {
                    firstName: 'Rajesh',
                    lastName: 'Kumar',
                    email: 'rajesh.mechanic@example.com',
                    phone: '9876543210',
                    password: 'password123',
                    role: 'mechanic',
                },
                {
                    firstName: 'Amit',
                    lastName: 'Sharma',
                    email: 'amit.mechanic@example.com',
                    phone: '9876543211',
                    password: 'password123',
                    role: 'mechanic',
                },
                {
                    firstName: 'Suresh',
                    lastName: 'Patel',
                    email: 'suresh.mechanic@example.com',
                    phone: '9876543212',
                    password: 'password123',
                    role: 'mechanic',
                },
            ];

            for (const mechanicData of sampleMechanics) {
                // Check if user already exists
                const existingUser = await User.findOne({ email: mechanicData.email });

                if (!existingUser) {
                    // Create user
                    const user = await User.create(mechanicData);

                    // Create mechanic profile with location
                    await Mechanic.create({
                        userId: user._id,
                        licenseNumber: `LIC${Math.random().toString(36).substring(7).toUpperCase()}`,
                        licenseExpiry: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000), // 1 year from now
                        skills: ['engine', 'brake', 'electrical'],
                        yearsOfExperience: Math.floor(Math.random() * 10) + 5,
                        shopName: `${mechanicData.firstName}'s Auto Repair`,
                        shopAddress: 'Delhi, India',
                        isVerified: true,
                        isAvailable: true,
                        totalRating: 4.5,
                        totalReviews: 10,
                        location: {
                            type: 'Point',
                            coordinates: [
                                77.1025 + (Math.random() - 0.5) * 0.1, // longitude (Delhi area)
                                28.7041 + (Math.random() - 0.5) * 0.1, // latitude (Delhi area)
                            ],
                        },
                    });

                    console.log(`✅ Created mechanic: ${mechanicData.firstName} ${mechanicData.lastName}`);
                }
            }
        } else {
            console.log(`ℹ️  Found ${mechanicCount} existing mechanics`);

            // Update existing mechanics without location
            const mechanicsWithoutLocation = await Mechanic.find({
                $or: [
                    { location: { $exists: false } },
                    { 'location.coordinates': { $exists: false } },
                ],
            });

            if (mechanicsWithoutLocation.length > 0) {
                console.log(`📝 Updating ${mechanicsWithoutLocation.length} mechanics with default locations...`);

                for (const mechanic of mechanicsWithoutLocation) {
                    mechanic.location = {
                        type: 'Point',
                        coordinates: [
                            77.1025 + (Math.random() - 0.5) * 0.1, // longitude (Delhi area)
                            28.7041 + (Math.random() - 0.5) * 0.1, // latitude (Delhi area)
                        ],
                    };
                    await mechanic.save();
                }

                console.log('✅ Updated mechanics with locations');
            }
        }

        console.log('\n🎉 Database initialization complete!');
        console.log('📍 Geospatial index created for nearby mechanics feature');

    } catch (error) {
        console.error('❌ Error initializing database:', error);
    } finally {
        await mongoose.connection.close();
        console.log('👋 Disconnected from MongoDB');
    }
};

// Run the initialization
initializeDatabase();
