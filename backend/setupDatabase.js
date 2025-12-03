const mongoose = require('mongoose');
const Mechanic = require('./src/models/Mechanic');
const User = require('./src/models/User');
require('dotenv').config();

const setupDatabase = async () => {
    try {
        // Connect to MongoDB
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('✅ Connected to MongoDB');

        // Create geospatial index
        await Mechanic.collection.createIndex({ location: '2dsphere' });
        console.log('✅ Created 2dsphere index on Mechanic.location');

        // Update existing mechanics without location
        const mechanicsWithoutLocation = await Mechanic.find({
            $or: [
                { location: { $exists: false } },
                { 'location.coordinates': { $size: 0 } },
            ],
        });

        if (mechanicsWithoutLocation.length > 0) {
            console.log(`📝 Updating ${mechanicsWithoutLocation.length} mechanics with locations...`);

            for (const mechanic of mechanicsWithoutLocation) {
                mechanic.location = {
                    type: 'Point',
                    coordinates: [
                        77.1025 + (Math.random() - 0.5) * 0.2, // longitude (Delhi area)
                        28.7041 + (Math.random() - 0.5) * 0.2, // latitude (Delhi area)
                    ],
                };
                await mechanic.save();
            }

            console.log('✅ Updated mechanics with locations');
        }

        // Check if we need sample mechanics
        const mechanicCount = await Mechanic.countDocuments();

        if (mechanicCount === 0) {
            console.log('📝 Creating sample mechanics...');

            const sampleMechanics = [
                {
                    user: {
                        firstName: 'Rajesh',
                        lastName: 'Kumar',
                        email: 'rajesh.mechanic@example.com',
                        phone: '9876543210',
                        password: 'password123',
                        role: 'mechanic',
                    },
                    mechanic: {
                        licenseNumber: 'LIC001',
                        skills: ['engine', 'brake', 'electrical'],
                        yearsOfExperience: 8,
                        shopName: "Rajesh's Auto Repair",
                        shopAddress: 'Connaught Place, Delhi',
                        coordinates: [77.2167, 28.6139],
                    },
                },
                {
                    user: {
                        firstName: 'Amit',
                        lastName: 'Sharma',
                        email: 'amit.mechanic@example.com',
                        phone: '9876543211',
                        password: 'password123',
                        role: 'mechanic',
                    },
                    mechanic: {
                        licenseNumber: 'LIC002',
                        skills: ['transmission', 'suspension', 'tire'],
                        yearsOfExperience: 10,
                        shopName: "Amit's Auto Service",
                        shopAddress: 'Karol Bagh, Delhi',
                        coordinates: [77.1900, 28.6519],
                    },
                },
                {
                    user: {
                        firstName: 'Suresh',
                        lastName: 'Patel',
                        email: 'suresh.mechanic@example.com',
                        phone: '9876543212',
                        password: 'password123',
                        role: 'mechanic',
                    },
                    mechanic: {
                        licenseNumber: 'LIC003',
                        skills: ['engine', 'electrical', 'general'],
                        yearsOfExperience: 12,
                        shopName: "Suresh Auto Works",
                        shopAddress: 'Lajpat Nagar, Delhi',
                        coordinates: [77.2436, 28.5677],
                    },
                },
            ];

            for (const data of sampleMechanics) {
                const existingUser = await User.findOne({ email: data.user.email });

                if (!existingUser) {
                    const user = await User.create(data.user);

                    await Mechanic.create({
                        userId: user._id,
                        licenseNumber: data.mechanic.licenseNumber,
                        licenseExpiry: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000),
                        skills: data.mechanic.skills,
                        yearsOfExperience: data.mechanic.yearsOfExperience,
                        shopName: data.mechanic.shopName,
                        shopAddress: data.mechanic.shopAddress,
                        isVerified: true,
                        isAvailable: true,
                        totalRating: 4.5,
                        totalReviews: 10,
                        location: {
                            type: 'Point',
                            coordinates: data.mechanic.coordinates,
                        },
                    });

                    console.log(`✅ Created mechanic: ${data.user.firstName} ${data.user.lastName}`);
                }
            }
        }

        console.log('\n🎉 Database setup complete!');
    } catch (error) {
        console.error('❌ Error:', error.message);
    } finally {
        await mongoose.connection.close();
    }
};

setupDatabase();
