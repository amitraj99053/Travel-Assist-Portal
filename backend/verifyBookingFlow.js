const axios = require('axios');

const API_URL = 'http://localhost:5000/api';

async function runVerification() {
    try {
        const timestamp = Date.now();
        const mechanicEmail = `mech_${timestamp}@test.com`;
        const userEmail = `user_${timestamp}@test.com`;
        const phone = timestamp.toString().slice(-10);

        // 1. Register Mechanic
        console.log('1. Registering Mechanic...');
        try {
            await axios.post(`${API_URL}/auth/register-mechanic`, {
                firstName: 'Test', lastName: 'Mechanic', email: mechanicEmail, phone: phone,
                password: 'password123', passwordConfirm: 'password123',
                licenseNumber: 'LIC123', licenseExpiry: '2030-01-01', skills: ['tire'],
                yearsOfExperience: 5, shopName: 'Test Shop', shopAddress: 'Delhi'
            });
        } catch (e) {
            if (e.response && e.response.status === 409) {
                console.log('   Mechanic already exists, logging in...');
            } else {
                throw e;
            }
        }

        // Login Mechanic
        const mechLogin = await axios.post(`${API_URL}/auth/login`, {
            email: mechanicEmail, password: 'password123'
        });
        const mechToken = mechLogin.data.data.token;
        console.log('   Mechanic registered and logged in.');

        // 2. Register User
        console.log('2. Registering User...');
        await axios.post(`${API_URL}/auth/register`, {
            firstName: 'Test', lastName: 'User', email: userEmail, phone: (parseInt(phone) + 1).toString(),
            password: 'password123', passwordConfirm: 'password123'
        });

        // Login User
        const userLogin = await axios.post(`${API_URL}/auth/login`, {
            email: userEmail, password: 'password123'
        });
        const userToken = userLogin.data.data.token;
        console.log('   User registered and logged in.');

        // 3. Create Service Request (User)
        console.log('3. Creating Service Request...');
        const reqRes = await axios.post(`${API_URL}/services`, {
            title: 'Flat Tire',
            description: 'Need help',
            issueType: 'breakdown',
            vehicleInfo: { make: 'Toyota', model: 'Camry', year: 2020 },
            location: { type: 'Point', latitude: 28.7041, longitude: 77.1025, address: 'Delhi' },
            priority: 'high'
        }, { headers: { Authorization: `Bearer ${userToken}` } });
        const requestId = reqRes.data.data.id;
        console.log(`   Request created (ID: ${requestId})`);

        // 4. Accept Request (Mechanic)
        console.log('4. Mechanic Accepting Request...');
        // Need to find it first? Or just use ID.
        const acceptRes = await axios.put(`${API_URL}/mechanics/request/${requestId}/accept`, {}, {
            headers: { Authorization: `Bearer ${mechToken}` }
        });
        const bookingId = acceptRes.data.data.bookingId;
        console.log(`   Request accepted. Booking created (ID: ${bookingId})`);

        // 5. Update Status (Mechanic)
        console.log('5. Updating status to "en_route"...');
        await axios.put(`${API_URL}/mechanics/booking/${bookingId}/status`, { status: 'en_route' }, {
            headers: { Authorization: `Bearer ${mechToken}` }
        });

        console.log('   Updating status to "arrived"...');
        await axios.put(`${API_URL}/mechanics/booking/${bookingId}/status`, { status: 'arrived' }, {
            headers: { Authorization: `Bearer ${mechToken}` }
        });

        // 6. Complete Job (Mechanic)
        console.log('6. Completing job...');
        await axios.put(`${API_URL}/mechanics/booking/${bookingId}/complete`, { totalCost: 500 }, {
            headers: { Authorization: `Bearer ${mechToken}` }
        });
        console.log('   Job completed.');

        // 7. Pay (User)
        console.log('7. Processing Payment (User)...');
        await axios.post(`${API_URL}/bookings/payment`, {
            bookingId: bookingId,
            amount: 500,
            paymentMethod: 'upi_qr'
        }, { headers: { Authorization: `Bearer ${userToken}` } });
        console.log('   Payment successful.');

        console.log('--- FULL FLOW VERIFIED SUCCESSFULLY ---');

    } catch (error) {
        console.error('Error:', error.response ? error.response.data : error.message);
    }
}

runVerification();
