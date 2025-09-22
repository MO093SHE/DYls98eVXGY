// 代码生成时间: 2025-09-23 00:30:34
 * Features:
 * - Monitoring system performance metrics like CPU usage, memory usage, etc.
 * - Error handling for robustness.
 * - Clear code structure and documentation for maintainability and extensibility.
 * - Adherence to JavaScript best practices.
 */

const Koa = require('koa');
const Router = require('koa-router');
const os = require('os'); // for getting system information

// Initialize a new Koa application
const app = new Koa();
const router = new Router();

// Middleware to use body parser for JSON requests
app.use(require('koa-json')());

/**
 * Get system performance metrics
 *
 * @returns {Promise<object>} - A promise that resolves to an object containing system performance metrics.
 */
function getSystemMetrics() {
  return new Promise((resolve, reject) => {
    // CPU
    const cpus = os.cpus();
    const cpuUsage = cpus.map(cpu => cpu.times.user).reduce((sum, time) => sum + time, 0) / cpus.length;

    // Memory
    const memUsage = process.memoryUsage();
    const memTotal = os.totalmem();

    // Resolve with system metrics
    resolve({
      cpuUsage,
      memoryUsage: memUsage,
      memoryTotal: memTotal
    });
  });
}

/**
 * Route to get system performance metrics
 *
 * @param {KoaContext} ctx - The Koa context object.
 */
router.get('/metrics', async ctx => {
  try {
    // Get system metrics
    const metrics = await getSystemMetrics();
    // Send the metrics as JSON response
    ctx.status = 200;
    ctx.body = metrics;
  } catch (error) {
    // Handle any errors that occur during the metric retrieval
    ctx.status = 500;
    ctx.body = { error: 'Failed to retrieve system metrics', message: error.message };
  }
});

// Use the router middleware
app.use(router.routes());
app.use(router.allowedMethods());

// Start the server and listen on port 3000
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`System Performance Monitor is running on port ${PORT}`);
});