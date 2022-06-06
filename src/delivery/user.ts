import { codes, dbCodes } from "../consts";
import UserRepository from "../repository/user";

export default new class UserDelivery {
    async create(request, reply) {
        const nickname = request.params.nickname;
        const fullname = request.body.fullname;
        const email = request.body.email;
        const about = request.body.about;
        const response = UserRepository.create(nickname, fullname, email, about);
        
        
        response.then((data) => {
            reply.code(codes.CREATED).send(data);
        }).catch(err =>{
            if (err.code == dbCodes.ALREADY_EXIST) {
                UserRepository.getAllUsers(nickname, email).then(data => {
                    reply.code(codes.ALREADY_EXISTS).send(data);
                    return;
                });
            }
        });
    };

    async getUserInfo(request, reply) {
        const response = UserRepository.getUserInfo(request.params.nickname);
        response.then((data) => {
            reply.code(codes.OK).send(data);
        }).catch(e => {
            reply.code(codes.NOT_FOUND).send(e);
        });
    };

    async updateUserInfo(request, reply) {
        const nickname = request.params.nickname;
        const fullname = request.body.fullname;
        const email = request.body.email;
        const about = request.body.about;
        const response = UserRepository.updateUserInfo(nickname, fullname, email, about);
        
        response.then((data)=> {
            reply.code(codes.OK).send(data);
        }).catch(err => {
            if (err.code === 0) {
                reply.code(codes.NOT_FOUND).send(err);
                return;
            }
            reply.code(codes.ALREADY_EXISTS).send(err);
        });
    }
};