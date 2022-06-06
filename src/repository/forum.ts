import { db } from "../db";

export default new class ForumRepository {
    create(user: string, title: string, slug: string) {
        return db.one({
            text: 'INSERT INTO forums ("user", title, slug) VALUES ((SELECT nickname from "users" where nickname = $1), $2, $3) RETURNING *',
            values: [user, title, slug],
        });
    };

    getUsers(slug: string, limit: string, since: string, desc: string) {
        let sortArguments= "", limitArguments = "", sinceArguments = "";
        if (limit)
            limitArguments  = `LIMIT ${limit}`;
        if (since)
            if (desc === 'true') {
                sinceArguments = `AND f.username < '${since}'`;
                sortArguments = 'DESC';
            } else {
                sinceArguments = `AND f.username > '${since}'`;
                sortArguments = 'ASC';
            }
        else if (desc === 'true')
            sortArguments = 'DESC';
        else
            sortArguments = 'ASC';
        return db.any({
            text:  `SELECT u.* FROM "users" as u JOIN forum_users as f ON u.id = f.userId WHERE f.forumSlug = $1 
            ${sinceArguments} ORDER BY f.username ${sortArguments} ${limit ? limitArguments : ''};`,
            values: [slug],
        });
    };

    getSingleForumBySlug(slug: string) {
        return db.one({
            text: `SELECT slug, title, "user" FROM forums WHERE slug=$$${slug}$$`,
        });
    };
    
    getAllForumsBySlug(slug: string) {
        return db.one({
            text: `SELECT * FROM forums WHERE slug=$$${slug}$$`,
        });
    };

    getForumsIDsBySlug(slug: string) {
        return db.one({
            text: `SELECT id FROM forums WHERE slug = $$${slug}$$`,
        });
    };

    getSingleForumByKey(key: number) {
        let property = isNaN(key) ? ' id = $1' : ' slug = $1';
        let text = `SELECT id AS thread_id, forum FROM threads WHERE ${property}`;
        return db.one({
            text: text,
            values: [key]
        });
    }

    update(postsLength: string, forum: string) {
        return db.none({
            text: `UPDATE forums SET posts=forums.posts+$1 WHERE slug=$2`,
            values: [postsLength, forum],
        });
    };

    updateUsers(users: string[], forum: string) {
        let text = 'INSERT INTO forum_users(userId, forumSlug, username) VALUES';
        users.forEach(element => {
            text += `((SELECT id FROM users WHERE users.nickname = $$${element}$$), $$${forum}$$, $$${element}$$),`;
        });
        text = text.slice(0, -1);
        text += ' ON CONFLICT DO NOTHING';
        return db.none({
            text: text,
        });
    };
};