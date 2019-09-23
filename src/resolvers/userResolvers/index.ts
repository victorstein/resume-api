import { Resolver, Mutation, Query, Args, Ctx } from "type-graphql";
import { ApolloError } from 'apollo-server-express'
import { User } from '../../models/user'
import bcrypt from 'bcryptjs'
import signUpInterface from './signUpInterface'

// User Resolvers
@Resolver()
class UserResolvers {

  @Query(() => String)
  hello () {
    return 'Hello World'
  }

  // SIGN UP MUTATION
  @Mutation(() => User)
  async signUp (
    @Args() { firstName, lastName, email, password }: signUpInterface,
    @Ctx() { userModel }: any
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

}

export default UserResolvers
