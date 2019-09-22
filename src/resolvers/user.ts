import { Resolver, Mutation, Arg, FieldResolver, Root, Query } from "type-graphql";
import { ApolloError } from 'apollo-server-express'
import { User, userModel } from '../models/user'
import bcrypt from 'bcryptjs'

@Resolver(User)
class UserResolvers {

  @Query(() => String)
  hello () {
    return 'Hello World'
  }

  @Mutation(() => User, { nullable: true })
  async signUp (
    @Arg('firstName') firstName: string,
    @Arg('lastName') lastName: string,
    @Arg('email') email: string,
    @Arg('password') password: string
  ): Promise<User> {
    try {
      // find the user by his/her email
      let user = await userModel.findOne({ email })

      // If user found return email already taken message
      if (user) { throw new Error('Email already in use') }

      // If no user found proceed to create user
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

  @FieldResolver(() => String)
  fullName (@Root() root: any) {
    return `${root.firstName} ${root.lastName}`
  }
}

export default UserResolvers
