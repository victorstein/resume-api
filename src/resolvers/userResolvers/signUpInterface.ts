import { IsEmail } from "class-validator";
import { ArgsType, Field } from "type-graphql";
import { emailAlreadyExists } from "../customValidators/emailAlreadyExists";

// Sign up interface
@ArgsType()
export default class signUpInterface {
  @Field({ nullable: false })
  firstName: string

  @Field({ nullable: false })
  lastName: string

  @Field({ nullable: false })
  @IsEmail(undefined, { message: 'Email is invalid. Please use a valid email' })
  @emailAlreadyExists({ message: 'Email already in use' })
  email: string

  @Field({ nullable: false })
  password: string
}