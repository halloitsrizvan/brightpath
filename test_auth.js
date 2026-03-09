const axios = require('axios');
async function test() {
    try {
        const loginRes = await axios.post('http://localhost:3000/api/auth/login', {
            email: 'admin@brightpath.com',
            password: 'admin123',
            role: 'admin'
        });
        const token = loginRes.data.token;
        console.log("Logged in, token length:", token.length);
        const getRes = await axios.get('http://localhost:3000/api/teachers', {
            headers: { Authorization: `Bearer ${token}` }
        });
        console.log("Teacher data length:", getRes.data.length);
    } catch (e) {
        if (e.response) {
            console.log("API Error:", e.response.status, e.response.data);
        } else {
            console.log("Error:", e.message);
        }
    }
}
test();
