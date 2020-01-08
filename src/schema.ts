import { buildSchema } from 'graphql'

export default buildSchema(`
  type Query {
    me: User
    todos: [Todo]
  }

  type Mutation {
    signup (name: String!, email: String!, password: String!): String
    login (email: String!, password: String!): String
    createTodo (title: String!): Todo
    deleteTodo (id: Int!): Int
    updateTodo (id: Int!, title: String!, done: Boolean!): Int
  }

  type User {
    id: Int!
    name: String!
    email: String!
  }

  type Todo {
    id: Int!
    title: String!
    done: Boolean!
    userId: Int!
  }
`)
