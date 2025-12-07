const axios = require('axios');

async function testRegister() {
    try {
        console.log('Attempting to register...');
        const response = await axios.post('http://localhost:5000/api/auth/register', {
            firstName: 'Test',
            lastName: 'Script',
            email: `testscript_${Date.now()}@example.com`,
            phone: '1234567890',
            password: 'password123',
            passwordConfirm: 'password123'
        }, { timeout: 5000 });
        console.log('Registration Success:', response.data);
    } catch (error) {
        if (error.code === 'ECONNABORTED') {
            console.error('Error: Request timed out (Backend hanging?)');
        } else {
            console.error('Registration Error:', error.message);
            if (error.response) {
                console.error('Status:', error.response.status);
                console.error('Data:', error.response.data);
            }
        }
    }
}

testRegister();
