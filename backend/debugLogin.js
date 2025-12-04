const axios = require('axios');

const API_URL = 'http://localhost:5000/api/auth';

async function testLogin() {
    try {
        // 1. Register
        const email = `debug_${Date.now()}@test.com`;
        console.log('Registering:', email);
        const regRes = await axios.post(`${API_URL}/register`, {
            firstName: 'Debug',
            lastName: 'User',
            email,
            phone: Date.now().toString().slice(-10),
            password: 'password123',
            passwordConfirm: 'password123'
        });
        console.log('Registration Success:', regRes.data.success);
        console.log('User ID from Register:', regRes.data.data.user._id || regRes.data.data.user.id);

        // 2. Login
        console.log('Logging in...');
        const loginRes = await axios.post(`${API_URL}/login`, {
            email,
            password: 'password123'
        });
        console.log('Login Success:', loginRes.data.success);
        console.log('User ID from Login:', loginRes.data.data.user._id || loginRes.data.data.user.id);
        console.log('Full User Object:', loginRes.data.data.user);

    } catch (error) {
        console.error('Error:', error.response ? error.response.data : error.message);
    }
}

testLogin();
