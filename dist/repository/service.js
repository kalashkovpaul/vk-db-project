var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { db } from "../db.js";
export default new class ServiceRepository {
    clear(callback) {
        return __awaiter(this, void 0, void 0, function* () {
            yield db.none('TRUNCATE TABLE forum_users, votes, posts, threads, forums, users;');
            callback();
        });
    }
    status(callback) {
        db.one(`SELECT (
            SELECT COUNT(*) FROM forums) AS f_count,
            (SELECT COUNT(*) FROM users) AS u_count,
            (SELECT COUNT(*) FROM threads) AS t_count,
            (SELECT COUNT(*) FROM posts) AS p_count`).then((data) => {
            callback({
                forum: data.f_count * 1,
                user: data.u_count * 1,
                thread: data.t_count * 1,
                post: data.p_count * 1,
            });
        });
    }
    ;
};
//# sourceMappingURL=service.js.map