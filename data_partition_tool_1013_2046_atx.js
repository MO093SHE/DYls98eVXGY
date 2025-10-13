// 代码生成时间: 2025-10-13 20:46:37
const Koa = require('koa');
const Router = require('koa-router');
const bodyParser = require('koa-bodyparser');

// Create a new Koa instance
const app = new Koa();
const router = new Router();

// Middleware to parse request body
app.use(bodyParser());

// Data partitioning and sharding function
function partitionData(data, numShards) {
  if (!Array.isArray(data) || typeof numShards !== 'number') {
    throw new Error('Invalid input: data must be an array and numShards must be a number.');
  }
  
  const shardedData = [];
  for (let i = 0; i < numShards; i++) {
    shardedData.push([]);
  }
  
  data.forEach((item, index) => {
    const shardIndex = index % numShards;
    shardedData[shardIndex].push(item);
  });
  
  return shardedData;
}

// API endpoint to partition data
router.post('/partition-data', async (ctx) => {
  try {
    // Get data from request body
    const { data, numShards } = ctx.request.body;
    
    // Call partition function
    const partitionedData = partitionData(data, numShards);
    
    // Send back partitioned data
    ctx.body = {
      status: 'success',
      data: partitionedData
    };
  } catch (error) {
    // Handle errors
    ctx.status = 400;
    ctx.body = {
      status: 'error',
      message: error.message
    };
  }
});

// Register the router
app.use(router.routes());
app.use(router.allowedMethods());

// Start the server
const port = 3000;
app.listen(port, () => {
  console.log(`Data partitioning tool running on http://localhost:${port}`);
});
