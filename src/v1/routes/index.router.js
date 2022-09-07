const userRouter = require('./user.router');
const projectRouter = require('./project.router');
const taskRouter = require('./task.router');

function route(app) {
    app.use('/api/v1/user', userRouter);
    app.use('/api/v1/project', projectRouter);
    app.use('/api/v1/task', taskRouter);
}
module.exports = route;
