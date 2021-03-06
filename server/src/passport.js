'use strict'

const passport = require('passport')
const BearerStrategy = require('passport-http-bearer').Strategy
const MagicStrategy = require("passport-magic").Strategy;
const logger = require('./logger')
const jwt = require('jsonwebtoken')

const { User } = require('./models')
const { encryptionSecret, magic } = require('./config')

module.exports = function() {
  const strategy = new MagicStrategy(async function(user, done) {
    try {
      const userMetadata = await magic.users.getMetadataByIssuer(user.issuer);
      const existingUser = await User.findOne({
        where: { email: userMetadata.email }
      });

      if (!existingUser) {
        logger.warn(
          `Passport authentication attempted for invalid user ${decodedToken.email}`
        );
        return done(null, false)
      }

      return done(null, existingUser);
    } catch (error) {
      logger.info(JSON.stringify(error));
    }
  });

  passport.serializeUser(function(user, done) {
    done(null, user.id)
  });

  passport.deserializeUser(async function(id, done) {
    logger.debug('Deserializing user with ID', id)
    try {
      const user = await User.findOne({ where: { id } })
      if (!user) {
        return done(null, false)
      }
      return done(null, user)
    } catch (e) {
      return done(e)
    }
  });

  passport.use(strategy);



  // passport.use(
  //   new BearerStrategy(async (token, done) => {
  //     logger.debug('Passport bearer strategy called')
  //     let decodedToken
  //     try {
  //       decodedToken = jwt.verify(token, encryptionSecret)
  //     } catch (error) {
  //       if (error.name !== 'TokenExpiredError') {
  //         logger.error('Could not decode token', error)
  //       }
  //       return done(null, false)
  //     }

  //     try {
  //       const user = await User.findOne({
  //         where: { email: decodedToken.email }
  //       })
  //       if (!user) {
  //         // No user with that email found.
  //         logger.warn(
  //           `Passport authentication attempted for invalid user ${decodedToken.email}`
  //         )
  //         return done(null, false)
  //       }
  //       // All good
  //       return done(null, user)
  //     } catch (e) {
  //       // Something went wrong. Return an error.
  //       logger.error(e)
  //       return done(e)
  //     }
  //   })
  // )
}
