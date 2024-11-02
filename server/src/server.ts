import { server } from './app.js';
import { connectPostgresDB } from './lib/db/prisma.db.js';

const initServer = async () => {
    try {
        await connectPostgresDB();
        server.listen(process.env.PORT, () => {
            console.log(`Server running on port ${process.env.PORT}`);
        });

    } catch (err) {
        console.error(err);
    }
};

initServer();