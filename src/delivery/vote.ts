import { codes } from '../consts.js';
import VoteRepository from '../repository/vote.js'


export default new class VotesDelivery {
    async createVote(request, reply) {
        const slug = request.params.slug;
        const response = VoteRepository.create(request.body.nickname, request.body.voice, slug);

        response.then(()=>{
            VoteRepository.getInfo(slug).then((data)=>{
                reply.code(codes.OK).send(data);
            });
        }).catch((err)=>{
            reply.code(codes.NOT_FOUND).send(err);
        });
    }
}
