import { ArgsType, Field } from "type-graphql"

@ArgsType()
export class loginInterface {
  @Field({ nullable: false })
  email: string

  @Field({ nullable: false })
  password: string
}