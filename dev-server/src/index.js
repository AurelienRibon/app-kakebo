'use strict';

const fastify = require('fastify')({ logger: true });

const PORT = process.env.PORT || 4000;

// -----------------------------------------------------------------------------
// ROUTES
// -----------------------------------------------------------------------------

fastify.get('/hello', async (request, reply) => {
  return { hello: 'world' };
});

// -----------------------------------------------------------------------------
// RUN
// -----------------------------------------------------------------------------

async function start() {
  try {
    await fastify.listen(PORT);
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};

start();
