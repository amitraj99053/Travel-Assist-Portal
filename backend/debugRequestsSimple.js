const mongoose = require('mongoose');
const ServiceRequest = require('./src/models/ServiceRequest');
require('dotenv').config();

const run = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        const count = await ServiceRequest.countDocuments({ status: 'pending' });
        console.log(`PENDING_COUNT: ${count}`);

        const nearby = await ServiceRequest.find({
            status: 'pending',
            $or: [{ mechanicId: { $exists: false } }, { mechanicId: null }],
            location: {
                $near: {
                    $geometry: { type: 'Point', coordinates: [77.1025, 28.7041] },
                    $maxDistance: 5000000
                }
            }
        });
        console.log(`NEARBY_COUNT: ${nearby.length}`);
        if (nearby.length > 0) console.log(`FIRST_ID: ${nearby[0]._id}`);
    } catch (e) { console.error(e); }
    finally { await mongoose.connection.close(); }
};
run();
