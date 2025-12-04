const mongoose = require('mongoose');
const ServiceRequest = require('./src/models/ServiceRequest');
require('dotenv').config();

const debugRequests = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('✅ Connected to MongoDB');

        // 1. List all pending requests
        const allRequests = await ServiceRequest.find({ status: 'pending' });
        console.log(`\n📋 Total Pending Requests: ${allRequests.length}`);
        allRequests.forEach(r => {
            console.log(`- ID: ${r._id}, Title: ${r.title}, MechanicId: ${r.mechanicId}, Location: ${JSON.stringify(r.location?.coordinates)}`);
        });

        // 2. Run the specific query
        const latitude = 28.7041;
        const longitude = 77.1025;
        const maxDistance = 20;

        console.log(`\n🔍 Running $near query: Lat: ${latitude}, Long: ${longitude}, MaxDist: ${maxDistance}km`);

        const nearbyRequests = await ServiceRequest.find({
            status: 'pending',
            $or: [{ mechanicId: { $exists: false } }, { mechanicId: null }],
            location: {
                $near: {
                    $geometry: {
                        type: 'Point',
                        coordinates: [longitude, latitude],
                    },
                    $maxDistance: maxDistance * 1000,
                },
            },
        });

        console.log(`✅ Found ${nearbyRequests.length} nearby requests via query.`);
        nearbyRequests.forEach(r => {
            console.log(`- ID: ${r._id}, Title: ${r.title}`);
        });

    } catch (error) {
        console.error('❌ Error:', error.message);
    } finally {
        await mongoose.connection.close();
    }
};

debugRequests();
