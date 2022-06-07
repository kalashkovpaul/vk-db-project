import { db } from "../db.js";
export default new class ThreadRepository {
    create(author, created, forum, message, title, slug) {
        let text = ` INSERT INTO threads (author, created, forum, message, title, slug)`;
        text += `VALUES ((SELECT nickname FROM users WHERE nickname=$$${author}$$), $1, (SELECT slug FROM forums WHERE slug=$2),
        $$${message}$$, $$${title}$$, $3) RETURNING author, created, forum, message, title, votes, id ${slug ? ', slug' : ''}`;
        return db.one({
            text: text,
            values: [created, forum, slug],
        });
    }
    ;
    getAllThreadsBySlug(slug) {
        return db.one({
            text: `SELECT * FROM threads WHERE slug=$$${slug}$$`,
        });
    }
    ;
    getAllThreadsIDsBySlug(slug) {
        return db.one({
            text: `SELECT id FROM threads WHERE slug=$$${slug}$$`,
        });
    }
    ;
    getInfoBySlug(slug) {
        let res = 'slug = $1';
        if (!isNaN(slug)) {
            res = ' id = $1';
        }
        return db.one({
            text: `SELECT author, created, forum, id, message, votes, slug, title FROM threads 
            WHERE ${res}`,
            values: [slug],
        });
    }
    ;
    getAllThreadsByID(id) {
        return db.one({
            text: 'SELECT threads.id FROM threads WHERE threads.id = $1',
            values: [id],
        });
    }
    getAllThreads(desc, limit, since, slug) {
        let sortArguments = "", limitArguments = "", sinceArguments = "";
        if (since) {
            if (desc === 'true') {
                sinceArguments = `AND created <= '${since}'`;
                sortArguments = 'DESC';
            }
            else {
                sinceArguments = `AND created >= '${since}'`;
                sortArguments = 'ASC';
            }
        }
        else {
            sinceArguments = '';
            if (desc === 'true') {
                sortArguments = 'DESC';
            }
            else {
                sortArguments = 'ASC';
            }
        }
        if (limit) {
            limitArguments = `LIMIT ${limit}`;
        }
        return db.any({
            text: `SELECT * FROM threads WHERE forum=$1 ${sinceArguments} ORDER BY created ${sortArguments} ${limit ? limitArguments : ''};`,
            values: [slug]
        });
    }
    update(title, message, slug) {
        let text = "";
        const args = [];
        let countArgs = 1;
        if (title == undefined && message == undefined) {
            text = `SELECT created, id, title,
            slug, message, author,
            forum FROM threads WHERE `;
            if (!isNaN(slug)) {
                text += 'id = $1';
            }
            else {
                text += 'slug = $1';
            }
        }
        else {
            text = 'UPDATE threads SET ';
            if (title != undefined) {
                text += `title = $${countArgs++},`;
                args.push(title);
            }
            if (message != undefined) {
                text += `message = $${countArgs++},`;
                args.push(message);
            }
            text = text.slice(0, -1);
            if (!isNaN(slug)) {
                text += ` WHERE id = $${countArgs++} `;
            }
            else {
                text += ` WHERE slug = $${countArgs++} `;
            }
            text += ` RETURNING created, id, title, slug, message, author, forum`;
        }
        args.push(slug);
        return db.one({
            text: text,
            values: args,
        });
    }
};
//# sourceMappingURL=thread.js.map