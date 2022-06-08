import { db } from "../db.js";
import { PostType, ThreadType } from "../types.js";

export default new class PostRepository {
    create(thread: ThreadType, users: string[], posts: PostType[]) {
        let i = 1;
        const args = [];
        let text = 'INSERT INTO posts (edited, author, message, thread_id, parent_id, forum) VALUES ';
        posts.forEach(singlePost => {
            users.push(singlePost.author);
            if (singlePost.parent == null) {
                text += `(FALSE, $$${singlePost.author}$$, $$${singlePost.message}$$, $${i}, NULL, $$${thread.forum}$$),`;
            } else {
                text += `(FALSE, $$${singlePost.author}$$, $$${singlePost.message}$$, (SELECT (CASE WHEN EXISTS 
                    ( SELECT id FROM posts p WHERE p.id=$$${singlePost.parent}$$ AND p.thread_id=$${i}) 
                    THEN $${i} ELSE NULL END)), $$${singlePost.parent}$$, $$${thread.forum}$$),`;
            }
            i++;
            args.push(thread.thread_id);
        });
        text = text.slice(0, text.length - 1);
        text += ' RETURNING author, id, created, thread_id AS thread, parent_id AS parent, forum, message';
        return db.any({
            text: text, 
            values: args,
        });
    };

    getInfo(ID: string) {
        return db.one({
            text: `SELECT id, parent_id AS parent, thread_id AS thread,
             message, edited AS "isEdited", created, forum, author FROM posts WHERE id = $$${ID}$$`,
        });
    };

    update(message: string, ID: string) {
        const args = [];
        let text = "";
        
        if (message == undefined) {
            text = 'SELECT id, author, message, created, forum, thread_id AS thread FROM posts WHERE id=$1';
        } else {
            text = `UPDATE posts SET edited = message <> $1, `;
            text += `message = $1 WHERE id = $2 RETURNING id, message, author, created, forum, parent_id AS parent, thread_id AS thread, edited AS "isEdited"`;
            args.push(message);
        }
        args.push(ID);
        return db.one({
            text: text, 
            values: args
        });
    };

    getRelated(user: string, thread: ThreadType, forum: string, ID: string) {
        let joinQuery = ' FROM posts ';
        let selectQuery = `SELECT `;

        if (user != null) {
            joinQuery += 'JOIN users U ON U.nickname = posts.author ';
            selectQuery += 'U.nickname AS u_nickname, U.about AS u_about, U.fullname AS u_fullname, U.email AS u_email,';
        }

        if (thread != null) {
            joinQuery += 'JOIN threads ON threads.id = posts.thread_id ';
            selectQuery += `threads.author AS thread_author,
            threads.created AS thread_created,threads.votes AS thread_votes,
            threads.id AS thread_id,
            threads.title AS thread_title,
            threads.message AS thread_message,threads.slug AS thread_slug,
            threads.forum AS thread_forum,`;
        }

        if (forum != null) {
            joinQuery += 'JOIN forums F ON F.slug = posts.forum ';
            selectQuery += 'F.slug AS f_forum, F.threads AS f_threads, F.title as f_title, F.posts AS f_posts, F."user" AS f_user,';
        }
        selectQuery += `posts.id AS pid,
        posts.parent_id AS post_parent,
        posts.thread_id AS post_thread,
        posts.message AS post_message,
        posts.edited AS post_is_edited,
        posts.created AS post_created,posts.forum AS post_forum,
        posts.author AS post_author,`;
        
        joinQuery += ` WHERE posts.id = $$${ID}$$`;
        const text = selectQuery.slice(0, -1) + joinQuery;

        return db.one({
            text: text,
        });
    };

    getPostsByIDFlat(limit: string, since: string, desc: string, ID: string) {
        let text = "";
        let args = [ID];
        let i = 2;
        let flag = false;
        text = `SELECT id, thread_id AS thread, created,
                message, parent_id AS parent, author, forum FROM
                (SELECT * FROM posts WHERE thread_id = $1 `;
        if (desc === 'true') {
            flag = true;
        }
        if (since != undefined) {
            args.push(since);
            if (!flag) {
                text += ` AND id > $${i++}`;
            } else {
                text += ` AND id < $${i++}`;
            }
        }
        if (!flag) {
            text += ' ) p ORDER BY created, id  ';
        } else {
            text += ' ) p ORDER BY created DESC, id DESC ';
        }

        if (limit != undefined) {
            text += ` LIMIT $${i++}`;
            args.push(limit);
        }
        return db.any({text: text, values: args});
    };

    getPostsByIDTree(limit: string, since: string, desc: string, ID: string) {
        let args = [ID];
        let i = 2;
        const descQuery = desc === 'true' ? 'DESC' : '';
        let sinceQuery = '';
        let limitSql = '';
        if (since != undefined) {
            args.push(since);
            sinceQuery = `
                AND (path ${desc === 'true' ? '<' : '>'}
            (SELECT path FROM posts WHERE id = $${i++})) `;
        }

        if (limit != undefined) {
            limitSql = ` LIMIT $${i++}`;
            args.push(limit);
        }

        const text = `
        SELECT id, author, created, message, parent_id AS parent,
        forum, thread_id AS thread
        FROM posts
        WHERE thread_id = $1 ${sinceQuery}
        ORDER BY path ${descQuery}
        ${limitSql}`;
        return db.any({text: text, values: args});
    };

    getPostsByIDParent(limit: string, since: string, desc: string, ID: string) {
        let text = `SELECT author, created, forum, id, edited,
                    message, parent_id AS parent, thread_id AS thread
                    FROM posts
                    WHERE path[1] IN (
                    SELECT id FROM posts`;
        let args = [ID];
        let i = 2;
        const descQuery = desc === 'true' ? 'DESC' : '';
        let sinceQuery;
        let limitSql;
        if (since == undefined) {
            sinceQuery = '';
        } else {
            sinceQuery = ` AND id ${desc === 'true' ? '<' : '>'}`; 
            sinceQuery += `(SELECT path[1] FROM posts WHERE id = $${i++})`;
            args.push(since);
        }

        if (limit == undefined) {
            limitSql = '';
        } else {
            limitSql = `LIMIT $${i++}`;
            args.push(limit);
        }
        text += ` WHERE thread_id=$1 AND parent_id IS NULL
        ${sinceQuery}
        ORDER BY id ${descQuery}
        ${limitSql})`
        text += ` AND thread_id=$1
        ORDER BY path[1] ${descQuery}, path`;
        return db.any({text: text, values: args});
    };
};