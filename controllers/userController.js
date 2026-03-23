const userService = require('../services/userService');

exports.getUsers = (req, res) => {
    res.json(userService.findAll());
};

exports.checkId = (req, res) => {
    const isExist = userService.findById(req.params.id);
    res.send({ "ok": !isExist });
};

exports.login = (req, res) => {
    const { id, password } = req.body; 
    const user = userService.loginCheck(id, password);

    if (user) {
        res.status(200).send({
            "ok": true,
            "status": 200,
            "data": { id: user.id, name: user.name }
        });
    } else {
        res.status(401).send({ "ok": false, "message": "아이디 또는 비밀번호가 틀렸습니다." });
    }
};

exports.join = (req, res) => {
    const { id, password, name, age } = req.body;
    const result = userService.signUp(id, password, name, age);

    if (!result) {
        return res.status(400).send({ "ok": false, "message": "이미 존재하는 아이디입니다." });
    }
    res.send({ "ok": true, "message": "회원가입 성공" });
};