import cron from "node-cron";
import { prisma } from "./prisma.db.js";
export const initVerificationCodeCleanup = async () => {
    cron.schedule("* * * * *", async () => {
        // console.log(
        //     "Running scheduled cleanup task for expired verification codes"
        // );
        try {
            const deletedCodes = await prisma.verificationCode.deleteMany({
                where: {
                    expiresAt: {
                        lt: new Date(),
                    },
                },
            });
            // console.log(`Deleted ${deletedCodes.count} expired verification codes`);
        }
        catch (error) {
            console.error("Error cleaning up expired verification codes: ", error);
        }
    });
};
