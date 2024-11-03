import passport from "passport";
import { User as IUser } from "../types/types.js";
import  GoogleStrategy from "passport-google-oauth20";
import { GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, GOOGLE_CALLBACK_URL } from "../config/config.js";
import { prisma } from "../lib/db/prisma.db.js";
import { generatePassword, generateTokens, generateUsername, hashPassword } from "../utils/helper.util.js";


const intializeGoogleOAuth = () => {
  passport.use(new GoogleStrategy.Strategy({
    clientID: GOOGLE_CLIENT_ID,
    clientSecret: GOOGLE_CLIENT_SECRET,
    callbackURL: GOOGLE_CALLBACK_URL,
  },
  async function(accessToken: string, refreshToken: string, profile: any, done: (error: any, user?: any) => void) {
    try {
        const { id: googleId, displayName, emails } = profile;
        const email = emails && emails.length > 0 ? emails[0].value : null;
        let user = await prisma.user.findUnique({ where: { googleId } });
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
                googleId
              }
            });
            // rabbitmq send email and password
          } else {
            user = await prisma.user.update({
              where: { email },
              data: { googleId }
            });
          }
        }
        const { accessToken, refreshToken } = await generateTokens(user);
        return done(null, { user, accessToken, refreshToken });
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