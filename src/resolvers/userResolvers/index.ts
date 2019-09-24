import { Resolver, Mutation, Query, Args, Ctx, UseMiddleware } from "type-graphql";
import { ApolloError, AuthenticationError } from 'apollo-server-express'
import { User } from '../../models/user'
import bcrypt from 'bcryptjs'
import signUpInterface from './signUpInterface'
import { loginInterface } from "./loginInterface"
import jwt from 'jsonwebtoken'
import { context } from "src/models";
import { isAuth } from "../middlewares/isAuth";

// Retreive env constants
const {
  TOKEN_SECRET,
  TOKEN_EXPIRATION,
  REFRESH_TOKEN_SECRET,
  REFRESH_TOKEN_EXPIRATION
} = process.env

// User Resolvers
@Resolver()
class UserResolvers {

  @Query(() => User)
  @UseMiddleware(isAuth)
  async me (
    @Ctx() { payload, userModel }: context
  ): Promise<User> {
    try {
      // find user using the id in the payload
      const user = await userModel.findById(payload!.id)

      // if no user return error
      if (!user) { throw new Error('Unable to find your information') }

      // if user found return it
      return user
    } catch (e) {
      console.log(e)
      throw new ApolloError(e)
    }
  }

  // SIGN UP MUTATION
  @Mutation(() => User)
  async signUp (
    @Args() { firstName, lastName, email, password }: signUpInterface,
    @Ctx() { userModel }: context
  ): Promise<User> {
    try {
      // Hash password
      const hashedPassword = await bcrypt.hash(password, 10)

      // create and return user
      return userModel.create({
        firstName,
        lastName,
        password: hashedPassword,
        email
      })
    } catch (e) {
      console.log(e)
      throw new ApolloError(e)
    }
  }

  // SIGN IN MUTATION
  @Mutation(() => String)
  async login (
    @Args() { email, password }: loginInterface,
    @Ctx() { userModel, res }: context
  ): Promise<string> {
    try {
      // Retreive the user based on the email
      const user = await userModel.findOne({ email })

      // If the user is not found return error
      if (!user) { throw new Error('Unable to login. Invalid credentials') }

      // If the use is found proceed to compare the password
      let valid = await bcrypt.compare(password, user.password)

      // If the password is invalid return error
      if (!valid) { throw new Error('Unable to login. Invalid credentials') }

      // Create a refresh token
      let refreshToken = jwt.sign({ id: user._id }, REFRESH_TOKEN_SECRET!, { expiresIn: REFRESH_TOKEN_EXPIRATION })

      // If the password is valid send a coockie in the header with the refresh token
      res.cookie('aegs', refreshToken, { httpOnly: true })

      // If there are no errors create a token
      const token = jwt.sign({ id: user._id }, TOKEN_SECRET!, { expiresIn: TOKEN_EXPIRATION })

      // Return the token
      return token
    } catch (e) {
      console.log(e)
      throw new AuthenticationError(e)
    }
  }

}

export default UserResolvers
