var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { codes, dbCodes } from "../consts.js";
import ThreadRepository from "../repository/thread.js";
import ForumRepository from "../repository/forum.js";
import PostRepository from "../repository/post.js";
export default new class ThreadsDelivery {
    createThread(request, reply) {
        return __awaiter(this, void 0, void 0, function* () {
            const forum = request.body.forum ? request.body.forum : request.params.slug;
            const author = request.body.author;
            const created = request.body.created;
            const title = request.body.title;
            const message = request.body.message;
            const slug = request.body.slug ? request.body.slug : undefined;
            const response = ThreadRepository.create(author, created, forum, message, title, slug);
            response.then((data) => __awaiter(this, void 0, void 0, function* () {
                reply.code(codes.CREATED).send(data);
            })).catch((err) => {
                if (err.code === dbCodes.ALREADY_EXIST) {
                    ThreadRepository.getAllThreadsBySlug(slug).then((data) => {
                        reply.code(codes.ALREADY_EXISTS).send(data);
                    });
                    return;
                }
                reply.code(codes.NOT_FOUND).send(err);
            });
        });
    }
    getThreads(request, reply) {
        return __awaiter(this, void 0, void 0, function* () {
            const response = ThreadRepository.getAllThreads(request.query.desc, request.query.limit, request.query.since, request.params.slug);
            response.then((data) => {
                if (data.length === 0) {
                    ForumRepository.getAllForumsBySlug(request.params.slug).then(() => {
                        reply.code(codes.OK).send(data);
                    }).catch((err) => {
                        reply.code(codes.NOT_FOUND).send(err);
                    });
                    return;
                }
                reply.code(codes.OK).send(data);
            }).catch((err) => {
                reply.code(codes.NOT_FOUND).send(err);
            });
        });
    }
    getPosts(request, reply) {
        return __awaiter(this, void 0, void 0, function* () {
            const slug = request.params.slug;
            if (!isNaN(slug)) {
                getPostsID(request, reply, slug);
                return;
            }
            else {
                const response = ThreadRepository.getAllThreadsBySlug(slug);
                response.then((data) => {
                    getPostsID(request, reply, data.id);
                }).catch((err) => {
                    reply.code(codes.NOT_FOUND).send(err);
                });
            }
        });
    }
    getThreadInfo(request, reply) {
        return __awaiter(this, void 0, void 0, function* () {
            const response = ThreadRepository.getInfoBySlug(request.params.slug);
            response.then((data) => {
                if (data.length === 0) {
                    reply.code(codes.NOT_FOUND).send({});
                    return;
                }
                reply.code(codes.OK).send(data);
            }).catch((err) => {
                reply.code(codes.NOT_FOUND).send(err);
            });
        });
    }
    updateThread(request, reply) {
        return __awaiter(this, void 0, void 0, function* () {
            const response = ThreadRepository.update(request.body.title, request.body.message, request.params.slug);
            response.then((data) => {
                if (data.length === 0) {
                    reply.code(codes.NOT_FOUND).send({});
                    return;
                }
                reply.code(codes.OK).send(data);
            }).catch((err) => {
                reply.code(codes.NOT_FOUND).send(err);
            });
        });
    }
};
function getPostsID(request, reply, id) {
    const sort = request.query.sort;
    let response;
    switch (sort) {
        case 'flat':
            response = PostRepository.getPostsByIDFlat(request.query.limit, request.query.since, request.query.desc, id);
            break;
        case 'tree':
            response = PostRepository.getPostsByIDTree(request.query.limit, request.query.since, request.query.desc, id);
            break;
        case 'parent_tree':
            response = PostRepository.getPostsByIDParent(request.query.limit, request.query.since, request.query.desc, id);
            break;
        default:
            response = PostRepository.getPostsByIDFlat(request.query.limit, request.query.since, request.query.desc, id);
            break;
    }
    response.then((data) => {
        if (data.length == 0) {
            ThreadRepository.getAllThreadsByID(id).then((res) => {
                if (res.length === 0) {
                    reply.code(codes.NOT_FOUND).send({}); // TODO ???
                    return;
                }
                reply.code(codes.OK).send([]);
                return;
            }).catch((err) => {
                reply.code(codes.NOT_FOUND).send(err);
            });
        }
        else {
            reply.code(codes.OK).send(data);
        }
    }).catch((err) => {
        reply.code(codes.NOT_FOUND).send(err);
    });
}
//# sourceMappingURL=thread.js.map