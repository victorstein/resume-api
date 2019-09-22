import { prop, Typegoose } from '@hasezoey/typegoose'
import { ObjectType, Field, ID } from 'type-graphql'
import Joi from '@hapi/joi'

@ObjectType({ description: 'User Model' })
export class User extends Typegoose {
  @Field(() => ID)
  id: string

  @Field()
  @prop({ required: true })
  firstName!: string

  @Field()
  @prop({ required: true })
  lastName!: string

  @Field()
  @prop({ required: true, lowercase: true, validate: {
   validator: (val) => {
      let assert = Joi.string().email({ minDomainSegments: 2 }).validate(val)
      return Boolean(!assert.error)
    },
    message: 'Invalid email address' 
  }})
  email!: string

  @Field()
  fullName: string

  @prop({ required: true })
  password!: string
}

export const userModel = new User().getModelForClass(User)
