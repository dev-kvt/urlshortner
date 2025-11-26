// Application Factory 
// 
const fastify = require("fastify");
const dbPlugin = require('./plugins/postgres');
//import all our layer infrastructure 
// plugin 1.
// plugin 2.
// plugin 3. 

// interface layer (routes)

async function buildApps(opts = {} ){
  // fastify instance 
  const app = fastify(opts);
  
  app.get('/', (request, response) => {
    return { status: 'ok', server: 'fastify-shortner' }
  });
  
  return app;
}

module.exports = buildApps;