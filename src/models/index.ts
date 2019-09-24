import { userModel } from './user'
import { Request, Response } from 'express'

export interface context {
  userModel: any
  req: Request
  res: Response
  payload?: { id: string }
}

export default {
  userModel
}