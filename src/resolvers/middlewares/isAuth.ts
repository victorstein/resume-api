import { context } from '../../models'
import { MiddlewareFn } from 'type-graphql'
import { AuthenticationError } from 'apollo-server-core'
import jwt from 'jsonwebtoken'

const { TOKEN_SECRET } = process.env

export const isAuth: MiddlewareFn<context> = ({ context }, next) => {
  let authHeader = context.req.headers['authorization']

  try {
    // Return an error if the authorization header is missing
    if (!authHeader) { throw new AuthenticationError('Please provide a valid authorization header') }
    
    // Isolate the token
    const token = authHeader.split(' ')[1]

    // Verify the token with JWT and extract the payload
    let payload = jwt.verify(token, TOKEN_SECRET!)

    // If theres a payload insert it to the context
    context.payload = payload as any
  } catch (e) {
    console.log(e)
    throw new AuthenticationError("Authorization Error")
  }
  return next()
}