import { codes, dbCodes } from '../consts'
import PostRepository from '../repository/post.js';
import ForumRepository from '../repository/forum.js';

export default new class PostDelivery {
    async createPost(request, reply) {
        const posts = request.body;
        const response = ForumRepository.getSingleForumByKey(request.params.slug);

        response.then((data)=>{
            if (posts.length == 0) {
                reply.code(codes.CREATED).send([]);
            }
            if (data.length == 0) {
                reply.code(codes.NOT_FOUND).send([]);
            }
            const users = [];
            PostRepository.create(data, users, posts).then(async (res) => {
                await ForumRepository.update(posts.length, data.forum);
                try {
                    await ForumRepository.updateUsers(users, data.forum);
                } catch (error) {
                    reply.code(codes.CREATED).send(res);
                }
                reply.code(codes.CREATED).send(res);
            }).catch((err)=>{
                if (err.code === dbCodes.NOT_NULL) {
                    reply.code(codes.ALREADY_EXISTS).send(err);
                }
                reply.code(codes.NOT_FOUND).send(err);
            });
        }).catch((err)=>{
            reply.code(codes.NOT_FOUND).send(err);
        });
    }

    async getInfo(request, reply) {
        const id = request.params.slug;
        const related = request.query.related;

        let userRelated;
        let forumRelated;
        let threadRelated;

        if (!related) {
            PostRepository.getInfo(id).then((data) => {
                reply.code(codes.OK).send({post: data});
            }).catch((err) => {
                reply.code(codes.NOT_FOUND).send(err);
            });
            return;
        } else {
            userRelated = related.includes('user');
            threadRelated = related.includes('thread');
            forumRelated = related.includes('forum');
        }
        
        const response = PostRepository.getRelated(userRelated, threadRelated, forumRelated, id);
        response.then((data)=>{
            const res: any = {};
            res.post = PostDelivery.#post(data);
            if (userRelated) {
                res.author = PostDelivery.#user(data);
            }
            if (threadRelated) {
                res.thread = PostDelivery.#thread(data);
            }
            if (forumRelated) {
                res.forum = PostDelivery.#forum(data);
            }
            reply.code(codes.OK).send(res);
        }).catch((err) => {
            reply.code(codes.NOT_FOUND).send(err);
        });
    }

    async updatePost(request, reply) {
        const response = PostRepository.update(request.body.message, request.params.id);
        response.then((data)=> {
            if (data.length == 0) {
                reply.code(codes.NOT_FOUND).send({});
                return;
            }
            reply.code(codes.OK).send(data);
        }).catch((err)=>{
            if (err.code == 0) {
                reply.code(codes.NOT_FOUND).send(err);
                return;
            }
            reply.code(codes.ALREADY_EXISTS).send(err);
        });
    }

    static #post(data) {
        return {
            author: data.post_author,
            id: data.pid,
            thread: data.post_thread,
            parent: data.post_parent,
            forum: data.post_forum,
            message: data.post_message,
            isEdited: data.pisEdited,
            created: data.post_created,
        };
    }

    static #user(data) {
        return {
            nickname: data.u_nickname,
            about: data.u_about,
            fullname: data.u_fullname,
            email: data.u_email,
        };
    }

    static #forum(data) {
        return {
            threads: data.f_threads,
            posts: data.f_posts,
            title: data.f_title,
            user: data.f_user,
            slug: data.f_forum,
        };
    }

    static #thread(data) {
        return {
            forum: data.thread_forum,
            author: data.thread_author,
            created: data.thread_created,
            votes: data.thread_votes,
            id: data.thread_id,
            title: data.thread_title,
            message: data.thread_message,
            slug: data.thread_slug,
        }
    }
}
