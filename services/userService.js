const UserInfo = require('../data/UserInfo');

let userdata = [
    { id: 'test', pw: 'test', name: '송유진', age: '22' },
    ...UserInfo
];

const findAll = () => userdata;
const findById = (id) => userdata.find(user => user.id === id);
const loginCheck = (id, pw) => userdata.find(user => user.id === id && user.pw === pw);

const signUp = (id, password, name, age) => {
    if (findById(id)) return null;
    
    const newUser = { id, pw: password, name, age: age || '알 수 없음' };
    userdata.push(newUser);
    return newUser;
};

module.exports = { findAll, findById, loginCheck, signUp };