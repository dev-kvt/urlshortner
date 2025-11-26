const fastifyPostgres = require('@fastify/postgres');
const fp = require("fastify-plugins");



async function dbConnector(fastify, options){
  await fastify.register(fastifyPostgres,
    {
      connectionString: process.env.DATABASE_URI
    });
  
  try
  {
    const client = await fastify.pg.connect();
    await client.query('SELECT NOW()');
    client.release();
    fastify.log.info("✅ Infrastructure: PostgreSQL connected and verified.");
  }
  catch(err)
  {
    fastify.log.error("🏴‍☠️ Infrastructure: PostgreSQL not connected & connection failed." , err);
    throw err;
  }
}

module.exports = fp(dbConnector);