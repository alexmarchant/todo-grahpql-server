import { Request } from 'express'
import { verifyJWT } from '../utils'
import { Todo } from '../db'

interface CreateTodoArgs {
  title?: string;
}

interface DeleteTodoArgs {
  id?: number;
}

interface UpdateTodoArgs {
  id?: number;
  title?: string;
  done?: boolean;
}

export default {
  async todos(args: {}, request: Request): Promise<Todo[]> {
    const token = verifyJWT(request)
    const todos = await Todo.findAll({ where: { userId: token.id } })
    if (!todos) {
      return []
    }
    return todos
  },

  async createTodo(args: CreateTodoArgs, request: Request): Promise<Todo> {
    const token = verifyJWT(request)
    if (!args.title) {
      throw new Error('Missing required arguments')
    }
    
    const todo = new Todo()
    todo.title = args.title
    todo.userId = token.id
    await todo.save()

    return todo
  },

  async deleteTodo(args: DeleteTodoArgs, request: Request): Promise<number> {
    const token = verifyJWT(request)
    if (!args.id) {
      throw new Error('Missing required arguments')
    }

    await Todo.destroy({ where: { id: args.id, userId: token.id } })
    return args.id
  },

  async updateTodo(args: UpdateTodoArgs, request: Request): Promise<number> {
    const token = verifyJWT(request)
    if (!args.id || !args.title) {
      throw new Error('Missing required arguments')
    }

    await Todo.update({
      title: args.title,
      done: args.done,
    }, {
      where: {
        id: args.id,
        userId: token.id,
      },
    })
    return args.id
  },
}
