var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __classPrivateFieldGet = (this && this.__classPrivateFieldGet) || function (receiver, state, kind, f) {
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
    return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
};
var _a, _PostDelivery_post, _PostDelivery_user, _PostDelivery_forum, _PostDelivery_thread;
import { codes, dbCodes } from '../consts.js';
import PostRepository from '../repository/post.js';
import ForumRepository from '../repository/forum.js';
export default new (_a = class PostDelivery {
        createPost(request, reply) {
            return __awaiter(this, void 0, void 0, function* () {
                const posts = request.body;
                const response = ForumRepository.getSingleForumByKey(request.params.slug);
                response.then((data) => {
                    if (posts.length == 0) {
                        reply.code(codes.CREATED).send([]);
                    }
                    if (data.length == 0) {
                        reply.code(codes.NOT_FOUND).send([]);
                    }
                    const users = [];
                    PostRepository.create(data, users, posts).then((res) => __awaiter(this, void 0, void 0, function* () {
                        yield ForumRepository.update(posts.length, data.forum);
                        try {
                            yield ForumRepository.updateUsers(users, data.forum);
                        }
                        catch (error) {
                            reply.code(codes.CREATED).send(res);
                        }
                        reply.code(codes.CREATED).send(res);
                    })).catch((err) => {
                        if (err.code === dbCodes.NOT_NULL) {
                            reply.code(codes.ALREADY_EXISTS).send(err);
                        }
                        reply.code(codes.NOT_FOUND).send(err);
                    });
                }).catch((err) => {
                    reply.code(codes.NOT_FOUND).send(err);
                });
            });
        }
        getInfo(request, reply) {
            return __awaiter(this, void 0, void 0, function* () {
                const id = request.params.slug;
                const related = request.query.related;
                let userRelated;
                let forumRelated;
                let threadRelated;
                if (!related) {
                    PostRepository.getInfo(id).then((data) => {
                        reply.code(codes.OK).send({ post: data });
                    }).catch((err) => {
                        reply.code(codes.NOT_FOUND).send(err);
                    });
                    return;
                }
                else {
                    userRelated = related.includes('user');
                    threadRelated = related.includes('thread');
                    forumRelated = related.includes('forum');
                }
                const response = PostRepository.getRelated(userRelated, threadRelated, forumRelated, id);
                response.then((data) => {
                    const res = {};
                    res.post = __classPrivateFieldGet(PostDelivery, _a, "m", _PostDelivery_post).call(PostDelivery, data);
                    if (userRelated) {
                        res.author = __classPrivateFieldGet(PostDelivery, _a, "m", _PostDelivery_user).call(PostDelivery, data);
                    }
                    if (threadRelated) {
                        res.thread = __classPrivateFieldGet(PostDelivery, _a, "m", _PostDelivery_thread).call(PostDelivery, data);
                    }
                    if (forumRelated) {
                        res.forum = __classPrivateFieldGet(PostDelivery, _a, "m", _PostDelivery_forum).call(PostDelivery, data);
                    }
                    reply.code(codes.OK).send(res);
                }).catch((err) => {
                    reply.code(codes.NOT_FOUND).send(err);
                });
            });
        }
        updatePost(request, reply) {
            return __awaiter(this, void 0, void 0, function* () {
                const response = PostRepository.update(request.body.message, request.params.id);
                response.then((data) => {
                    if (data.length == 0) {
                        reply.code(codes.NOT_FOUND).send({});
                        return;
                    }
                    reply.code(codes.OK).send(data);
                }).catch((err) => {
                    if (err.code == 0) {
                        reply.code(codes.NOT_FOUND).send(err);
                        return;
                    }
                    reply.code(codes.ALREADY_EXISTS).send(err);
                });
            });
        }
    },
    _PostDelivery_post = function _PostDelivery_post(data) {
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
    },
    _PostDelivery_user = function _PostDelivery_user(data) {
        return {
            nickname: data.u_nickname,
            about: data.u_about,
            fullname: data.u_fullname,
            email: data.u_email,
        };
    },
    _PostDelivery_forum = function _PostDelivery_forum(data) {
        return {
            threads: data.f_threads,
            posts: data.f_posts,
            title: data.f_title,
            user: data.f_user,
            slug: data.f_forum,
        };
    },
    _PostDelivery_thread = function _PostDelivery_thread(data) {
        return {
            forum: data.thread_forum,
            author: data.thread_author,
            created: data.thread_created,
            votes: data.thread_votes,
            id: data.thread_id,
            title: data.thread_title,
            message: data.thread_message,
            slug: data.thread_slug,
        };
    },
    _a);
//# sourceMappingURL=post.js.map