import passport from "passport";
import passportJWT from "passport-jwt";
import { usersService } from "../services/usersServices.js";
import { NotFoundError } from "../helpers/NotFoundError.js";
import { errorBody } from "../controllers/responseModels.js";

const jwtSecret = process.env.JWT_SECRET;
const ExtractJWT = passportJWT.ExtractJwt;
const Strategy = passportJWT.Strategy;
const params = {
  secretOrKey: jwtSecret,
  jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(),
};

// JWT Strategy
passport.use(
  new Strategy(params, function (payload, done) {
    usersService
      .getById(payload.id)
      .then((usr) => {
        if (!usr) {
          return done(new NotFoundError("User not found"));
        }
        return done(null, usr);
      })
      .catch((err) => done(err));
  })
);

const auth = (req, res, next) => {
  passport.authenticate("jwt", { session: false }, (err, usr) => {
    const token = extractBearerTokenFromHeaders(req);
    if (!usr || err || token !== usr.token) {
      return res.status(401).json(errorBody("Not authorized"));
    }
    req.user = usr;
    next();
  })(req, res, next);
};

function extractBearerTokenFromHeaders(req) {
  return req.headers.authorization?.replace("Bearer ", "");
}

export const passportConfig = {
  initialize: () => passport.initialize(),
  authenticate: auth,
};
