// 代码生成时间: 2025-10-12 03:45:25
const Koa = require('koa');
const Router = require('koa-router');
const bodyParser = require('koa-bodyparser');
const app = new Koa();
const router = new Router();

// 数据存储，这里使用简单的数组模拟数据库
const issues = [];

// 中间件，解析请求体
app.use(bodyParser());

// 获取所有缺陷
router.get('/issues', async (ctx) => {
    try {
        ctx.body = issues;
    } catch (error) {
        ctx.status = 500;
        ctx.body = { error: 'Internal server error' };
    }
});

// 添加新缺陷
router.post('/issues', async (ctx) => {
    try {
        const issue = ctx.request.body;
        if (!issue || !issue.title) {
            ctx.status = 400;
            ctx.body = { error: 'Issue title is required' };
            return;
        }
        issues.push(issue);
        ctx.status = 201;
        ctx.body = issue;
    } catch (error) {
        ctx.status = 500;
        ctx.body = { error: 'Internal server error' };
    }
});

// 更新缺陷
router.put('/issues/:id', async (ctx) => {
    try {
        const id = ctx.params.id;
        const updatedIssue = ctx.request.body;
        const issueIndex = issues.findIndex(issue => issue.id === id);
        if (issueIndex === -1) {
            ctx.status = 404;
            ctx.body = { error: 'Issue not found' };
            return;
        }
        issues[issueIndex] = updatedIssue;
        ctx.body = updatedIssue;
    } catch (error) {
        ctx.status = 500;
        ctx.body = { error: 'Internal server error' };
    }
});

// 删除缺陷
router.delete('/issues/:id', async (ctx) => {
    try {
        const id = ctx.params.id;
        const issueIndex = issues.findIndex(issue => issue.id === id);
        if (issueIndex === -1) {
            ctx.status = 404;
            ctx.body = { error: 'Issue not found' };
            return;
        }
        issues.splice(issueIndex, 1);
        ctx.status = 204;
        ctx.body = null;
    } catch (error) {
        ctx.status = 500;
        ctx.body = { error: 'Internal server error' };
    }
});

// 注册路由
app.use(router.routes()).use(router.allowedMethods());

// 启动服务器
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Issue Tracking System running on port ${PORT}`);
});
