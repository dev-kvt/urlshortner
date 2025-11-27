module.exports = async function (fastify, opts) {
  const shortenSchema = {
    body: {
      type: 'object',
      required: ['url'],
      properties: {
        url: { type: "string", format: 'url' }
      },
      additionalProperties: false,
    },
    response: {
      // define success response 
      201: {
        type: 'object',
        properties: {
          short_code: { type: 'string' }
        }
      }
    }
  }
};


fastify.post('/shorten', { schema: shortenSchema }, async (request, reply) => {
  const { url: longUrl } = request.body;
  const shortCode = await fastify.shortener.shorten(longUrl);
  reply.code(201).send({ short_code: shortCode });
});

