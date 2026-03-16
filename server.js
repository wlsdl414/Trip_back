const express = require('express')
const cors = require('cors');
const app = express()
const port = 8080

let userdata = [
    { id: 'test', pw: 'test', name: '송유진', age: '22' },
];

app.use(express.json())
app.use(cors());

app.get('/', (req, res) => {
    res.status(200);
    res.send("백엔드연결")
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})

app.get('/api/users', (req, res) => {
    res.json(userdata); // JSON 형식으로 데이터 응답
});

app.get('/idcheck/:id', function(req, res) {
    const id = req.params.id;   
    const idcheck = userdata.some(user => user.id === id);
    res.send({ "ok": !idcheck });
});

app.get('/test', (req, res) => {
    res.json({ message: "개발 프로젝트 백엔드 연결 성공!", data: "이것은 서버 데이터입니다." });
});

app.get('/login/:id/:pw', function(req, res) {
    const id = req.params.id;
    const pw = req.params.pw;
    if (id && pw) {
        const user = userdata.find(user => user.id === id && user.pw === pw);

        if (user) {
            res.send({ 
                "ok": true,
                user : {id: user.id, name : user.name, pw : user.pw, age : user.age}
            });
        } else {
            res.send({ "ok": false});
        }
    } else {
        res.send({ "ok": false});
    }
});

app.post('/user/signup', function(req, res) {
    const { id, password, name } = req.body;
    console.log("들어온 아이디:", id);

    const user = userdata.find(user => user.id === id);
    console.log("찾은 유저:", user);

    if (user) {
        return res.status(400).send({
            "ok" : false,
            "message" : "이미 존재하는 아이디입니다."
        });
    }

    userdata.push({
        id: id,
        pw : password,
        name : name,
        age : '20'
    });

    console.log("현재 전체 유저 목록:", userdata);

    res.send({"ok":true, "message":"회원가입 성공"});
});