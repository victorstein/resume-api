import { prop, Typegoose } from '@hasezoey/typegoose'
import { ObjectType, Field, ID, Root } from 'type-graphql'

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
  @prop({ required: true, lowercase: true })
  email!: string

  @Field()
  fullName (@Root() parent: any): string {
    return `${parent.firstName} ${parent.lastName}`
  }

  @prop({ required: true })
  password!: string

  @prop({ default: false })
  @Field()
  active: boolean
}

export const userModel = new User().getModelForClass(User, { schemaOptions: { timestamps: true } })
