const Redis = require('ioredis');
const url = process.env.REDIS_URL;
if (!url) {
  console.log('REDIS_URL is missing');
  process.exit(1);
}
const redis = new Redis(url);
redis.on('error', (err) => {
  console.error('Redis Error:', err.message);
  process.exit(1);
});
redis.ping().then((res) => {
  console.log('Redis Ping Result:', res);
  process.exit(0);
}).catch(err => {
  console.error('Redis Ping Failed:', err.message);
  process.exit(1);
});
