// Imports
import { server, initServices } from './app.js';
import { connectPostgresDB } from './lib/db/prisma.db.js';
import { initVerificationCodeCleanup } from './lib/db/cron.db.js';
import { PORT } from './config/config.js';
// Server Listener
const initServer = async () => {
    try {
        await connectPostgresDB();
        server.listen(PORT, () => {
            console.log(`Server running on port ${PORT}`);
        });
        await initServices();
        await initVerificationCodeCleanup();
    }
    catch (err) {
        console.error(err);
    }
};
// Initialize Server
initServer();
