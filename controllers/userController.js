const userService = require('../services/userService');

exports.getUsers = async (req, res) => {
    try {
        const users = await userService.findAll();
        res.json(users);
    } catch (err) {
        res.status(500).send({ "ok": false, "message": "서버 에러" });
    }
};

exports.checkId = async (req, res) => {
    try {
        const user = await userService.findById(req.params.id);
        res.send({ "ok": !user }); // 유저가 없으면 true(사용 가능)
    } catch (err) {
        res.status(500).send({ "ok": false, "message": "서버 에러" });
    }
};

exports.login = async (req, res) => {
    const { id, pw } = req.body;
    console.log("로그인 시도:", id, pw);
    try {
        const user = await userService.loginCheck(id, pw);
        console.log("DB 조회 결과:", user);

        if (user) {
            if (!req.session) {
                console.error("세션 설정이 되어있지 않습니다!");
                return res.status(500).send({ "ok": false, "message": "세션 설정 에러" });
            }
            // [중요] 세션에 유저 정보 저장
            req.session.user = {
                id: user.id,
                name: user.name
            };

            // 세션 저장 후 응답
            req.session.save(() => {
                res.status(200).send({
                    "ok": true,
                    "status": 200,
                    "data": { id: user.id, name: user.name }
                });
            });
        } else {
            res.status(401).send({ "ok": false, "message": "아이디 또는 비밀번호가 틀렸습니다." });
        }
    } catch (err) {
        console.error("최종 에러 상세:", err);
        res.status(500).send({ "ok": false, "message": "서버 에러" });
    }
};

exports.join = async (req, res) => {
    console.log(req.body);
    // 프론트에서 보낸 userInfo 객체의 필드들을 구조 분해 할당으로 받음
    const { id, pw, name, phone, birth_date, nationality, nickname, address, gender } = req.body;
    
    try {
        const result = await userService.signUp(id, pw, name, phone, birth_date, nationality, nickname, address, gender);

        if (!result) {
            // 중복된 ID 혹은 닉네임이 있을 경우
            return res.status(400).send({ "ok": false, "message": "이미 존재하는 아이디 혹은 닉네임입니다." });
        }
        res.send({ "ok": true, "message": "회원가입 성공" });
    } catch (err) {
        console.error("회원가입 컨트롤러 에러:", err);
        res.status(500).send({ "ok": false, "message": "서버 내부 에러가 발생했습니다." });
    }
};

exports.checkSession = (req, res) => {
    if (req.session.user) {
        res.status(200).send({ "ok": true, "data": req.session.user });
    } else {
        res.status(401).send({ "ok": false, "message": "로그인 정보 없음" });
    }
};

exports.logout = (req, res) => {
    // 세션 정보를 파괴합니다.
    req.session.destroy((err) => {
        if (err) {
            console.error("세션 삭제 에러:", err);
            return res.status(500).send({ ok: false, message: "로그아웃 실패" });
        }
        
        // 클라이언트의 쿠키도 삭제 (key 이름은 app.js 설정과 동일해야 함)
        res.clearCookie('session_cookie_name'); 
        res.send({ ok: true, message: "로그아웃 성공" });
    });
};