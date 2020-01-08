import { Request } from 'express'
import { User } from '../db'
import { verifyJWT, createJWT } from '../utils'

interface SignupArgs {
  name?: string;
  email?: string;
  password?: string;
}

interface LoginArgs {
  email?: string;
  password?: string;
}

export default {
  async me(args: {}, request: Request): Promise<User> {
    const token = verifyJWT(request)
    const user = await User.findOne({ where: { id: token.id } })
    if (!user) {
      throw new Error('User not found')
    }
    return user
  },

  async signup(args: SignupArgs): Promise<string> {
    if (!args.name || !args.email || !args.password) {
      throw new Error('Missing required arguments')
    }

    const existingUser = await User.findOne({ where: { email: args.email }})
    if (existingUser) {
      throw new Error('Email already in use')
    }

    const user = new User()
    user.name = args.name
    user.email = args.email
    user.password = args.password
    await user.save()

    return createJWT(user)
  },

  async login(args: LoginArgs): Promise<string> {
    if (!args.email || !args.password) {
      throw new Error('Missing required arguments')
    }

    const user = await User.findOne({ where: { email: args.email }})
    if (!user) {
      throw new Error('No user found with that email')
    }

    if (args.password !== user.password) {
      throw new Error('Wrong password')
    }

    return createJWT(user)
  },
}
