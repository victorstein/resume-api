// Needed for typegraphql
import 'reflect-metadata'
// ENV import
import 'dotenv/config'
// Standard dependencies
import { ApolloServer } from 'apollo-server-express'
import express from 'express'
import { buildSchema } from 'type-graphql'
import Resolvers from './resolvers'
import mongoose from 'mongoose'
// Import model
import Models from './models'

(async () => {
  try {
    // Create express app
    const app = express()

    // Create schemas
    const schema = await buildSchema({
      resolvers: [...Resolvers]
    })

    // get database variables and port
    const { DB_USERNAME, DB_PASSWORD, DB_URI, PORT } = process.env

    // Connect to DB
    await mongoose.connect(`mongodb+srv://${DB_USERNAME}:${DB_PASSWORD}${DB_URI}`, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    })

    // Create apollo server
    let server = new ApolloServer({
      schema,
      playground: process.env.NODE_ENV !== 'production',
      context: ({ req, res }) => {
        return {
          req,
          res,
          ...Models
        }
      }
    })

    // Apply express middleware
    server.applyMiddleware({ app })

    // Start listening
    app.listen(PORT, () => console.log(`Server running in http://localhost:${PORT}/graphql`))
  } catch (e) {
    console.log(e)
  }
})()
