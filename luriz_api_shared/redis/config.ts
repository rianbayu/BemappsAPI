import { ServiceBroker } from 'moleculer'
require('dotenv').config()

export const Redis = new ServiceBroker({
    cacher: {
        type: "Redis",
        options: {
            // Prefix for keys
            prefix: "ses",          
            // set Time-to-live to 30sec.
            // ttl: 30, 
            // Turns Redis client monitoring on.
            // monitor: false 
            // Redis settings
            redis: {
                host: process.env.BW_REDIS_HOST || '127.0.0.1',
                port: process.env.BW_REDIS_PORT || 6379,                   
                db: 1 // session
            }
        }
    },
});