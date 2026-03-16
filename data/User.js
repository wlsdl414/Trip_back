/* server.js */
const express = require('express');
const cors = require('cors');
const app = express();

app.use(cors()); // 프론트엔드가 데이터를 가져갈 수 있게 허용

const userdata = [
    { id: 'test', pw: 'test', name: '송유진', age: '22' },
    { id: 'admin', pw: '1234', name: '관리자', age: '30' }
];

// 1. 주소창에 http://localhost:8080/api/users 를 치면 userdata를 보여주겠다!
app.get('/api/users', (req, res) => {
    res.json(userdata); 
});

app.listen(8080);