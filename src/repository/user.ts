import { db } from "../db.js";

export default new class UserRepository {
    create(nickname: string, fullname: string, email: string, about: string) {
        return db.one({
            text: `INSERT INTO users (nickname, fullname, email, about) VALUES 
            ($$${nickname}$$, $$${fullname}$$, $$${email}$$, $$${about}$$) RETURNING *`,
        });
    };

    getAllUsers(nickname: string, email: string) {
        return db.any({
            text: `SELECT * FROM users WHERE nickname=$$${nickname}$$ OR email=$$${email}$$`,
        });
    };

    getUserInfo(nickname: string) {
        return db.one({
            text: `SELECT about, email, nickname, fullname FROM users WHERE nickname=$$${nickname}$$`,
        });
    };

    updateUserInfo(nickname: string, fullname: string, email: string, about: string) {
        let text = 'UPDATE users SET ';
        let i = 1;
        const args = [];
        if (fullname != undefined) {
            text += `fullname = $${i++}, `;
            args.push(fullname);
        } else {
            text += `fullname = fullname, `;
        }
        if (email != undefined) {
            text += `email = $${i++}, `;
            args.push(email);
        } else {
            text += `email = email, `;
        }
        if (about != undefined) {
            text += `about = $${i++} `;
            args.push(about);
        } else {
            text += `about = about `;
        }
        args.push(nickname);
        text += `WHERE nickname = $${i} RETURNING *`;
        return db.one({
            text:text,
            values: args,
        });
    };
};