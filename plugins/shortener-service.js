const fp = require('fastify-plugins')
const {createShortLink} = require('../services/short')

async function shortenerServicePlugins(fastify, options){
  fastify.decorator('shortener', {
    async shorten(longUrl) {
      return createShortLink(fastify.pg, longUrl)
    }
  });
  fastify.log.info('✅ Service Layer: Shortener logic registered');
  
  module.exports = fp(shortenerServicePlugins);
  dependencies= ['@fastify/postgres']
}

