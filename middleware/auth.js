const passport = require('passport');
const localStrategy = require('passport-local').Strategy;
const JWTstrategy = require('passport-jwt').Strategy;
const { cookieExtractor } = require('../helpers');

const User = require('../models/User');
const UserType = require('../models/UserType');
const Restaurant = require('../models/Restaurant');

passport.use(
	'register',
	new localStrategy(
		{
			usernameField: 'email',
			passwordField: 'password',
			passReqToCallback: true,
		},
		async (req, email, password, done) => {
			try {
				const fullName = req.body.fullName;

				const url = req.originalUrl;
				let userType;
				console.log(url);
				switch (url) {
					case '/superAdmin/register/' + req.params.id:
						userType = await UserType.findOne({ name: 'Admin' }).lean().exec();
						break;
					case '/admin/register':
						userType = await UserType.findOne({ name: 'Courier' })
							.lean()
							.exec();
						break;
					default:
						userType = await UserType.findOne({ name: 'Customer' })
							.lean()
							.exec();
				}

				const user = await User.findOne({ email }).lean().exec();
				if (user) {
					return done(null, false, { msg: 'Email already in use' });
				}

				const newUser = new User({
					fullName: fullName,
					email: email,
					password: password,
					userType: userType._id,
				});
				await newUser.save();

				/* switch (userType.name) {
					case 'Admin':
						await Restaurant.findByIdAndUpdate(req.params.id, {
							admin: user._id,
						})
							.lean()
							.exec();
						break;
				}; */

				return done(null, newUser, { msg: 'Account created' });
			} catch (err) {
				done(err);
			}
		}
	)
);

passport.use(
	'login',
	new localStrategy(
		{ usernameField: 'email', passwordField: 'password' },
		async (email, password, done) => {
			try {
				const user = await User.findOne({ email });
				if (!user) {
					return done(null, false, {
						msg: 'User with given email does not exist',
					});
				}

				const validate = await user.isValidPassword(password);
				if (!validate) {
					return done(null, false, { msg: 'Incorrect password' });
				}

				return done(null, user, { msg: 'Logged in successfully' });
			} catch (err) {
				return done(err);
			}
		}
	)
);

passport.use(
	new JWTstrategy(
		{
			secretOrKey: 'TOP_SECRET',
			jwtFromRequest: cookieExtractor,
		},
		async (token, done) => {
			try {
				return done(null, token.user);
			} catch (err) {
				done(err);
			}
		}
	)
);
