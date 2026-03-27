const db = require('../db/db');

// 모든 유저 조회 (테스트용)
const findAll = async () => {
    const [rows] = await db.query('SELECT id, name FROM User');
    return rows;
};

// ID로 유저 찾기 (중복 확인용)
const findById = async (id) => {
    const [rows] = await db.query('SELECT * FROM User WHERE id = ?', [id]);
    return rows[0]; // 없으면 undefined 반환
};

// 로그인 체크 (ID와 PW 일치 확인)
const loginCheck = async (id, pw) => {
    const sql = 'SELECT id, name FROM User WHERE id = ? AND pw = ?';
    const [rows] = await db.query(sql, [id, pw]);
    return rows[0]; // 일치하는 유저가 있으면 객체, 없으면 undefined
};

// 회원가입
const signUp = async (id, pw, name, phone, birth_date, nationality, nickname, address, gender) => {
    // 1. 아이디 중복 확인 (기존 findById 활용)
    const userExists = await findById(id);
    if (userExists) return null;

    // 2. SQL 쿼리문 수정 (테이블명 'User'와 컬럼명 주의)
    const sql = `
        INSERT INTO User (id, pw, name, phone, birth_date, nationality, nickname, address, gender) 
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    // 3. DB에 저장할 값 배열 (선택 항목들은 값이 없을 경우 null 처리)
    const values = [
        id,
        pw,
        name,
        phone || null,
        birth_date || null,
        nationality || null,
        nickname || null,
        address || null,
        gender || null
    ];

    try {
        await db.query(sql, values);
        return { id, name }; // 성공 시 식별 정보 반환
    } catch (err) {
        // 닉네임 중복(UNIQUE 제약 조건) 시 에러 처리
        if (err.code === 'ER_DUP_ENTRY') return null;
        throw err;
    }
};

module.exports = { findAll, findById, loginCheck, signUp };