// 代码生成时间: 2025-10-08 00:00:34
const Koa = require('koa');
const bodyParser = require('koa-bodyparser');
const { createSign } = require('crypto');

// 定义Koa应用
const app = new Koa();

// 使用bodyParser中间件解析请求体
app.use(bodyParser());

// 定义数字签名工具的错误处理中间件
app.use(async (ctx, next) => {
    try {
        await next();
    } catch (error) {
        // 将错误信息设置到响应体
        ctx.status = error.status || 500;
        ctx.body = {
            success: false,
            message: error.message || 'Internal Server Error'
        };
    }
});

// 数字签名工具路由
app.use(async ctx => {
    const { data, secretKey } = ctx.request.body;
    if (!data || !secretKey) {
        // 缺少必要的参数
        ctx.status = 400;
        ctx.body = {
            success: false,
            message: 'Missing required parameters: data and secretKey'
        };
        return;
    }

    // 创建数字签名
    const signature = createSign('sha256')
        .update(data)
        .sign(secretKey);

    // 将签名结果设置到响应体
    ctx.status = 200;
    ctx.body = {
        success: true,
        signature: signature.toString('base64'),
        message: 'Digital signature generated successfully'
    };
});

// 设置Koa应用监听的端口
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Digital Signature Tool is running on port ${PORT}`);
});

// 数字签名工具的文档说明
/*
 * Digital Signature Tool
 *
 * This tool generates digital signatures for given data using a secret key.
 * It uses the crypto module's createSign function to create the signature.
 *
 * API Endpoint: POST /sign
 *
 * Request Body:
 * {
 *     "data": "string or Buffer to be signed",
 *     "secretKey": "private key used for signing"
 * }
 *
 * Response:
 * {
 *     "success": true,
 *     "signature": "base64 encoded digital signature",
 *     "message": "Digital signature generated successfully"
 * }
 *
 * Error Handling:
 * If the request body is missing required parameters, a 400 status code is returned.
 * If any internal server error occurs, a 500 status code is returned.
 */