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
import UserRepository from "../repository/user.js";
export default new class UserDelivery {
    create(request, reply) {
        return __awaiter(this, void 0, void 0, function* () {
            const nickname = request.params.nickname;
            const fullname = request.body.fullname;
            const email = request.body.email;
            const about = request.body.about;
            const response = UserRepository.create(nickname, fullname, email, about);
            response.then((data) => {
                reply.code(codes.CREATED).send(data);
            }).catch(err => {
                if (err.code == dbCodes.ALREADY_EXIST) {
                    UserRepository.getAllUsers(nickname, email).then(data => {
                        reply.code(codes.ALREADY_EXISTS).send(data);
                        return;
                    });
                }
            });
        });
    }
    ;
    getUserInfo(request, reply) {
        return __awaiter(this, void 0, void 0, function* () {
            const response = UserRepository.getUserInfo(request.params.nickname);
            response.then((data) => {
                reply.code(codes.OK).send(data);
            }).catch(e => {
                reply.code(codes.NOT_FOUND).send(e);
            });
        });
    }
    ;
    updateUserInfo(request, reply) {
        return __awaiter(this, void 0, void 0, function* () {
            const nickname = request.params.nickname;
            const fullname = request.body.fullname;
            const email = request.body.email;
            const about = request.body.about;
            const response = UserRepository.updateUserInfo(nickname, fullname, email, about);
            response.then((data) => {
                reply.code(codes.OK).send(data);
            }).catch(err => {
                if (err.code === 0) {
                    reply.code(codes.NOT_FOUND).send(err);
                    return;
                }
                reply.code(codes.ALREADY_EXISTS).send(err);
            });
        });
    }
};
//# sourceMappingURL=user.js.map