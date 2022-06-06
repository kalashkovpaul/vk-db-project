import { db } from "../db.js";

export default new class VotesRepository {
    getInfo(slug: number) {
        let text = 'SELECT id, created, slug, title, forum, author, message, votes FROM threads WHERE ';
        if (!isNaN(slug)) {
            text += `id = $$${slug}$$`;
        } else {
            text += `slug = $$${slug}$$`;
        }
        return db.one({
            text: text,
        });
    }

    create(nickname: string, voice: string, slug: number) {
        let text = 'INSERT INTO votes (thread_id, user_id, voice) VALUES';

        if (!isNaN(slug)) {
            text += ` ($1, $2, $3) `;
        } else {
            text += ` (
                (SELECT id FROM threads WHERE slug=$1), $2, $3
              )`;
        }
        text += `ON CONFLICT ON CONSTRAINT votes_user_thread_unique
        DO UPDATE SET voice = $3`
        if (!isNaN(slug)) {
            text += `WHERE votes.thread_id = $1 AND votes.user_id = $2`;
        } else {
            text += `WHERE votes.thread_id = (SELECT id FROM threads WHERE slug = $1)
            AND votes.user_id = $2`;
        }
        return db.none({
            text: text,
            values: [slug, nickname, voice],
        });
    }
}