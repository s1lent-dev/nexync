import { User as IUser } from "../types/types.js";
import passport from "passport";
import GithubStrategy from "passport-github2";
import { GITHUB_CLIENT_ID, GITHUB_CLIENT_SECRET, GITHUB_CALLBACK_URL } from "../config/config.js";
import { prisma } from "../lib/db/prisma.db.js";
import { generatePassword, generateTokens, generateUsername, hashPassword } from "../utils/helper.util.js";

const intializeGithubOAuth = () => {
    passport.use(new GithubStrategy.Strategy({
        clientID: GITHUB_CLIENT_ID,
        clientSecret: GITHUB_CLIENT_SECRET,
        callbackURL: GITHUB_CALLBACK_URL,
      },
      async function(accessToken: string, refreshToken: string, profile: any, done: (error: any, user?: any) => void) {
        try {
            const { id: githubId, username, emails } = profile;
            const email = emails && emails.length > 0 ? emails[0].value : null;
            let user = await prisma.user.findUnique({ where: { githubId } });
            if(!user) {
              user = await prisma.user.findUnique({ where: { email } });
              if(!user) {
                const { password } = await generatePassword();
                const { username } = await generateUsername();
                const hashedPassword = await hashPassword(password);
                user = await prisma.user.create({
                  data: {
                    username,
                    email,
                    password: hashedPassword,
                    githubId
                  }
                });
                // rabbitmq send email and password
              } else {
                user = await prisma.user.update({
                  where: { email },
                  data: { githubId }
                });
              }
            }
            const { accessToken, refreshToken } = await generateTokens(user);
            return done(null, { user, accessToken, refreshToken });
        } catch(err) {
            console.log("Error in Github Strategy", err);
            done(err);
        }
      }
    ));
    
    passport.serializeUser((user, done) => {
        done(null, user);
    });
    
    passport.deserializeUser((user: false | IUser | null | undefined, done) => {
        done(null, user);
    });
}

export { intializeGithubOAuth };