// Needed for typegraphql
import 'reflect-metadata'
// ENV import
import 'dotenv/config'
// Standard dependencies
import { ApolloServer } from 'apollo-server-express'
import express from 'express'
import { buildSchema } from 'type-graphql'
import Resolvers from './resolvers'

(async () => {
  // Create express app
  const app = express()

  // Create schemas
  const schema = await buildSchema({
    resolvers: [...Resolvers]
  })

  // Create apollo server
  let server = new ApolloServer({
    schema,
    playground: process.env.NODE_ENV !== 'production'
  })

  // Apply express middleware
  server.applyMiddleware({ app })

  // Start listening
  app.listen(process.env.PORT, () => console.log(`Server running in http://localhost:${process.env.PORT}/graphql`))
})()
