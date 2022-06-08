import Fastify from 'fastify';
import users from './delivery/user.js';
import forums from './delivery/forum.js';
import threads from './delivery/thread.js';
import service from './delivery/service.js';
import posts from './delivery/post.js';
import votes from './delivery/vote.js';

const api = Fastify();

api.post('/api/forum/create', forums.create);
api.get('/api/forum/:slug/details', forums.getForumInfo);
api.post('/api/forum/:slug/create', threads.createThread);
api.get('/api/forum/:slug/users', forums.getForumUsers);
api.get('/api/forum/:slug/threads', threads.getThreads);
api.post('/api/post/:id/details', posts.updatePost);
api.get('/api/post/:slug/details', posts.getInfo);
api.post('/api/service/clear', service.clear);
api.get('/api/service/status', service.status);
api.post('/api/thread/:slug/create', posts.createPost);
api.get('/api/thread/:slug/details', threads.getThreadInfo);
api.post('/api/thread/:slug/details', threads.updateThread);
api.get('/api/thread/:slug/posts', threads.getPosts);
api.post('/api/thread/:slug/vote', votes.createVote);
api.post('/api/user/:nickname/create', users.create);
api.get('/api/user/:nickname/profile', users.getUserInfo);
api.post('/api/user/:nickname/profile', users.updateUserInfo);

const startServer = async () => {
    api.addContentTypeParser('application/json', 
    { parseAs: "string"}, // buffer? 
    (req, body: string, done) => {
        try {
            const res = JSON.parse(body);
            done(null, res);
        } catch (e) {
            done(null, {});
        } 
    });
    await api.listen(5000, '0.0.0.0');
}
startServer();
