const express = require('express');
const cors = require('cors');
const session = require('express-session');
const MySQLStoreFactory = require('express-mysql-session');
const db = require('./db/db');

const userRoutes = require('./routes/userRoutes');

const app = express();
const port = 8080;

const MySQLStore = MySQLStoreFactory(session);
const sessionStore = new MySQLStore({}, db);

app.use(express.json());
app.use(cors({
    origin: 'http://localhost:3000', // 리액트 기본 포트 (자신의 환경에 맞게 수정)
    credentials: true
}));

app.use(session({
    key: 'session_cookie_name',
    secret: 'your_secret_key', // 보안을 위해 임의의 문자열 입력
    store: sessionStore,
    resave: false,
    saveUninitialized: false,
    cookie: {
        maxAge: 1000 * 60 * 60 * 24, // 24시간 유지
        httpOnly: true, // 클라이언트 JS에서 쿠키 접근 차단
        secure: false,  // 로컬(http) 환경이므로 false, 배포(https) 시 true
    }
}));

app.use('/', userRoutes);

app.get('/', (req, res) => {
    res.send("백엔드 연결 완료(app)");
});

app.listen(port, () => {
  console.log(`서버 연결 확인_ 포트 번호 :  ${port}`);
});