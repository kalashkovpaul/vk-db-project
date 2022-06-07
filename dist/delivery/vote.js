var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { codes } from '../consts.js';
import VoteRepository from '../repository/vote.js';
export default new class VotesDelivery {
    createVote(request, reply) {
        return __awaiter(this, void 0, void 0, function* () {
            const slug = request.params.slug;
            const response = VoteRepository.create(request.body.nickname, request.body.voice, slug);
            response.then(() => {
                VoteRepository.getInfo(slug).then((data) => {
                    reply.code(codes.OK).send(data);
                });
            }).catch((err) => {
                reply.code(codes.NOT_FOUND).send(err);
            });
        });
    }
};
//# sourceMappingURL=vote.js.map