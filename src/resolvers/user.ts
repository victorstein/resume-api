import { Resolver, Query } from "type-graphql";

@Resolver()
class User {
  @Query(() => String)
  hello () {
    return 'Hello World'
  }
}

export default User
