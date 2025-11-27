const fp = require('fastify-plugins');
const fastifyRedis = require('fastify/redis');

async function redisConnector(fastify, options){
  await fastify.register(fastifyRedis, {
    host: process.env.REDIS_HOST,
    port: process.env.REDIS_PORT,
    connectTimeout: 500,
    maxRetriesPerRequest: 1
  });
  
  fastify.log.info('✅ Infrastructure: Redis client connected.')
}

module.exports = fp(redisConnector);