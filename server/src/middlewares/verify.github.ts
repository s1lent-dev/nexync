import { User as IUser } from "../types/types.js";
import passport from "passport";
import GithubStrategy from "passport-github2";

const intializeGithubOAuth = () => {
    passport.use(new GithubStrategy.Strategy({
        clientID: process.env.GITHUB_CLIENT_ID || " ",
        clientSecret: process.env.GITHUB_CLIENT_SECRET || " ",
        callbackURL: process.env.GITHUB_OAUTH_REDIRECT_URL || " ",
      },
      async function(accessToken: string, refreshToken: string, profile: any, done: (error: any, user?: any) => void) {
        try {
            done(null, profile); // temporary
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