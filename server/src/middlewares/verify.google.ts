import passport from "passport";
import { User as IUser } from "../types/types.js";
import  GoogleStrategy from "passport-google-oauth20";


const intializeGoogleOAuth = () => {
  passport.use(new GoogleStrategy.Strategy({
    clientID: process.env.GOOGLE_CLIENT_ID || " ",
    clientSecret: process.env.GOOGLE_CLIENT_SECRET || " ",
    callbackURL: process.env.GOOGLE_OAUTH_REDIRECT_URL || " ",
  },
  async function(accessToken: string, refreshToken: string, profile: any, done: (error: any, user?: any) => void) {
    try {
        done(null, profile) // temporary
    } catch(err) {
        console.log("Error in google strategy", err);
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

export { intializeGoogleOAuth };