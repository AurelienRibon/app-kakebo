'use strict';

const fastify = require('fastify')({ logger: true });

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
    await fastify.listen(4000);
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};

start();
