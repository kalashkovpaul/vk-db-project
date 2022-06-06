import { codes, dbCodes } from "../consts";
import ThreadRepository from "../repository/thread";
import ForumRepository from "../repository/forum";
import PostRepository from "../repository/post";

export default new class ThreadsDelivery {
    async createThread(request, reply) {
        const forum = request.body.forum ? request.body.forum : request.params.slug;
        const author = request.body.author;
        const created = request.body.created;
        const title = request.body.title;
        const message = request.body.message;
        const slug = request.body.slug ? request.body.slug : undefined;
        const response = ThreadRepository.create(author, created, forum, message, title, slug);

        response.then(async (data)=>{
            reply.code(codes.CREATED).send(data);
        }).catch((err) => {
            if (err.code === dbCodes.ALREADY_EXIST) {
                ThreadRepository.getAllThreadsBySlug(slug).then((data) => {
                    reply.code(codes.ALREADY_EXISTS).send(data);
                });
                return;
            }
            reply.code(codes.NOT_FOUND).send(err);
        })
    }

    async getThreads(request, reply) {
        const response = ThreadRepository.getAllThreads(request.query.desc, request.query.limit, request.query.since,
            request.params.slug);
        response.then((data)=>{
            if (data.length === 0) {
                ForumRepository.getAllForumsBySlug(request.params.slug).then(()=>{
                    reply.code(codes.OK).send(data);
                }).catch((err)=>{
                    reply.code(codes.NOT_FOUND).send(err);
                });
                return;
            }
            reply.code(codes.OK).send(data);
        }).catch((err)=>{
            reply.code(codes.NOT_FOUND).send(err);
        });
    }

    async getPosts(request, reply) {
        const slug = request.params.slug;
        if (!isNaN(slug)) {
            getPostsID(request, reply, slug);
            return;
        } else {
            const response = ThreadRepository.getAllThreadsBySlug(slug);
            response.then((data)=>{
                getPostsID(request, reply, data.id);
            }).catch((err)=> {
                reply.code(codes.NOT_FOUND).send(err);
            });
        }
    }
    
    async getThreadInfo(request, reply) {
        const response = ThreadRepository.getInfoBySlug(request.params.slug);
        response.then((data)=>{
            if (data.length === 0) {
                reply.code(codes.NOT_FOUND).send({});
                return;
            }
            reply.code(codes.OK).send(data);
        }).catch((err)=>{
            reply.code(codes.NOT_FOUND).send(err);
        });
    }

    async updateThread(request, reply) {
        const response = ThreadRepository.update(request.body.title, 
            request.body.message, request.params.slug);

        response.then((data) => {
            if (data.length === 0) {
                reply.code(codes.NOT_FOUND).send({});
                return;
            }
            reply.code(codes.OK).send(data);
        }).catch((err) => {
            reply.code(codes.NOT_FOUND).send(err);
        });
    }
};

function getPostsID(request, reply, id) {
    const sort = request.query.sort;
    let response;
    switch (sort) {
        case 'flat':
            response = PostRepository.getPostsByIDFlat(request.query.limit,
                request.query.since, request.query.desc, id);
            break;
        case 'tree':
            response = PostRepository.getPostsByIDTree(request.query.limit,
                request.query.since, request.query.desc, id);
            break;
        case 'parent_tree':
            response = PostRepository.getPostsByIDParent(request.query.limit,
                request.query.since, request.query.desc, id);
            break;
        default:
            response = PostRepository.getPostsByIDFlat(request.query.limit,
                request.query.since, request.query.desc, id);
            break;
    }

    response.then((data)=>{
        if (data.length == 0) {
            ThreadRepository.getAllThreadsByID(id).then((res)=> {
                if (res.length === 0) {
                    reply.code(codes.NOT_FOUND).send({}); // TODO ???
                    return;
                }
                reply.code(codes.OK).send([]);
                return;
            }).catch((err)=>{
                reply.code(codes.NOT_FOUND).send(err);
            });
        } else {
            reply.code(codes.OK).send(data);
        }
    }).catch((err)=>{
        reply.code(codes.NOT_FOUND).send(err);
    });
}