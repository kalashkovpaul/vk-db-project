var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import fastifyLib from 'fastify';
import users from './delivery/user.js';
import forums from './delivery/forum.js';
import threads from './delivery/thread.js';
import service from './delivery/service.js';
import posts from './delivery/post.js';
import votes from './delivery/vote.js';
const fastify = fastifyLib();
fastify.post('/api/forum/create', forums.create);
fastify.get('/api/forum/:slug/details', forums.getForumInfo);
fastify.get('/api/forum/:slug/users', forums.getForumUsers);
fastify.post('/api/user/:nickname/create', users.create);
fastify.get('/api/user/:nickname/profile', users.getUserInfo);
fastify.post('/api/user/:nickname/profile', users.updateUserInfo);
fastify.post('/api/forum/:slug/create', threads.createThread);
fastify.get('/api/forum/:slug/threads', threads.getThreads);
fastify.get('/api/thread/:slug/details', threads.getThreadInfo);
fastify.post('/api/thread/:slug/details', threads.updateThread);
fastify.get('/api/thread/:slug/posts', threads.getPosts);
fastify.post('/api/service/clear', service.clear);
fastify.get('/api/service/status', service.status);
fastify.post('/api/thread/:slug/vote', votes.createVote);
fastify.get('/api/post/:slug/details', posts.getInfo);
fastify.post('/api/post/:id/details', posts.updatePost);
fastify.post('/api/thread/:slug/create', posts.createPost);
const start = () => __awaiter(void 0, void 0, void 0, function* () {
    fastify.addContentTypeParser('application/json', { parseAs: "string" }, (req, body, done) => {
        try {
            const res = JSON.parse(body);
            done(null, res);
        }
        catch (e) {
            done(null, {});
        }
    });
    yield fastify.listen(5000, '0.0.0.0');
});
start();
//# sourceMappingURL=api.js.map