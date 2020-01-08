import { Request } from 'express'
import jwt from 'jsonwebtoken'
import { User } from './db'

export interface JWTPayload {
  id: number;
  email: string;
  name: string;
}

export function verifyJWT(request: Request): JWTPayload {
  if (!request.headers.authorization) {
    throw new Error('Not authorized')
  }
  const token = request.headers.authorization.replace('Bearer ', '')
  try {
    return jwt.verify(token, '1234') as JWTPayload
  } catch(err) {
    throw new Error('Not authorized')
  }
}

export function createJWT(user: User): string {
  const payload: JWTPayload = {
    id: user.id,
    email: user.email,
    name: user.name,
  }
  return jwt.sign(payload, '1234', { expiresIn: '1y' })
}