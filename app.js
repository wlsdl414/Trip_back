const express = require('express');
const cors = require('cors');
const userRoutes = require('./routes/userRoutes');

const app = express();
const port = 8080;

app.use(express.json());
app.use(cors());

app.use('/api', userRoutes);

app.get('/', (req, res) => {
    res.send("백엔드 연결 완료");
});

app.listen(port, () => {
  console.log(`서버 연결 확인_ 포트 번호 :  ${port}`);
});