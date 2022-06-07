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
import ForumRepository from "../repository/forum.js";
export default new class ForumDelivery {
    create(request, reply) {
        return __awaiter(this, void 0, void 0, function* () {
            const slug = request.body.slug;
            const response = ForumRepository.create(request.body.user, request.body.title, slug);
            response.then((data) => {
                reply.code(codes.CREATED).send(data);
            }).catch(e => {
                if (e.code === dbCodes.ALREADY_EXIST) {
                    ForumRepository.getSingleForumBySlug(slug).then((data) => {
                        reply.code(codes.ALREADY_EXISTS).send(data);
                    });
                }
                else
                    reply.code(codes.NOT_FOUND).send(e);
            });
        });
    }
    ;
    getForumInfo(request, reply) {
        return __awaiter(this, void 0, void 0, function* () {
            const response = ForumRepository.getAllForumsBySlug(request.params.slug);
            try {
                const data = yield response;
                reply.code(codes.OK).send(data);
            }
            catch (e) {
                if (e.code === 0)
                    reply.code(codes.NOT_FOUND).send(e);
            }
            ;
        });
    }
    ;
    getForumUsers(request, reply) {
        return __awaiter(this, void 0, void 0, function* () {
            const slug = request.params.slug;
            const response = ForumRepository.getUsers(slug, request.query.limit, request.query.since, request.query.desc);
            try {
                const data = yield response;
                if (data.length === 0) {
                    try {
                        const forumsID = yield ForumRepository.getForumsIDsBySlug(slug);
                        if (forumsID.length !== 0) {
                            reply.code(codes.OK).send([]);
                            return;
                        }
                    }
                    catch (e) {
                        if (e.code === 0) {
                            reply.code(codes.NOT_FOUND).send(e);
                            return;
                        }
                    }
                    ;
                }
                else
                    reply.code(codes.OK).send(data);
            }
            catch (e) {
                if (e.code === 0) {
                    reply.code(codes.NOT_FOUND).send(e);
                    return;
                }
            }
        });
    }
};
//# sourceMappingURL=forum.js.map