import { codes, dbCodes} from "../consts.js";
import ForumRepository from "../repository/forum.js";

export default new class ForumDelivery {
    async create(request, reply) { // TODO: types
        const slug = request.body.slug;
        const response = ForumRepository.create(request.body.user, request.body.title, slug);

        response.then((data) => {
            reply.code(codes.CREATED).send(data);
        }).catch(e => {
            if (e.code === dbCodes.ALREADY_EXIST) {
                ForumRepository.getSingleForumBySlug(slug).then((data) => {
                    reply.code(codes.ALREADY_EXISTS).send(data);
                });
            } else reply.code(codes.NOT_FOUND).send(e);
        });
    };

    async getForumInfo(request, reply) {
        const response = ForumRepository.getAllForumsBySlug(request.params.slug);
        try {
            const data = await response;
            reply.code(codes.OK).send(data);
        } catch (e) {
            if (e.code === 0)
                reply.code(codes.NOT_FOUND).send(e);
        };
    };

    async getForumUsers(request, reply) {
        const slug = request.params.slug;
        const response = ForumRepository.getUsers(slug, request.query.limit, 
            request.query.since, request.query.desc);
        try {
            const data = await response;
            if (data.length === 0) {
                try {
                    const forumsID = await ForumRepository.getForumsIDsBySlug(slug);
                    if (forumsID.length !== 0) {
                        reply.code(codes.OK).send([]);
                        return;
                    }
                } catch (e) {
                    if (e.code === 0) {
                        reply.code(codes.NOT_FOUND).send(e);
                        return;
                    }
                };
            } else reply.code(codes.OK).send(data);
        } catch (e) {
            if (e.code === 0) {
                reply.code(codes.NOT_FOUND).send(e);
                return;
            }
        }
    }
};