module.exports = async function (fastify, opts) {
  const redirectSchema = {
    type: 'object',
    required: ['shortcode'],
    properties: {
      shortcode: { type: string, minLength: 3, maxLength: 10 }
      
      
    }
  }
};


fastify.get('/:shortcode', { schema: redirectSchema }, async (request, reply) => {
  const { shortcode } = request.params;
  const longUrl = await fastify.shortener.redeem(shortcode);
  if (!longUrl) 
  {
    fastify.long.warn(`Redirect Failed : Short code not found ${shortcode}`);
    return reply.callNotFound();
  }
  reply.redirect(302, longUrl);
});