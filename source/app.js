const fastify = require("fastify");
const dbPlugin = require('./plugins/postgres');
const redisPlugin = require('./plugins/redis');
// Renamed to match our file: shortenerServicePlugin
const shortenerServicePlugin = require("./plugins/shortener-service"); 
const shortenRoute = require("./routes/shorten");
const redirectRoute = require('./routes/redirect');

async function buildApps(opts = {}) {
    // fastify instance 
    const app = fastify(opts);

    // 1. REGISTER INFRASTRUCTURE (The resources everything else depends on)
    await app.register(dbPlugin);
    await app.register(redisPlugin);

    // 2. REGISTER SERVICE LAYER (The logic that USES the infrastructure)
    // CRITICAL: Must be registered AFTER dbPlugin and redisPlugin.
    await app.register(shortenerServicePlugin);

    // 3. REGISTER ROUTES (The interface that USES the service layer)
    // CRITICAL: Must be registered AFTER shortenerServicePlugin.
    app.register(shortenRoute, { prefix: '/api/v1' });
    app.register(redirectRoute);

    // Health check route
    app.get('/health', async (request, reply) => {
        // Check if the plugins successfully decorated the instance
        const dbStatus = app.pg ? 'connected' : 'disconnected';
        const redisStatus = app.redis ? 'connected' : 'disconnected';

        return { 
            status: 'ok', 
            server: 'fastify-shortener', 
            db: dbStatus,
            redis: redisStatus
        };
    });

    return app;
}

module.exports = buildApps;