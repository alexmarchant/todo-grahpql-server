import express from 'express'
import graphqlHTTP from 'express-graphql'
import { initDB } from './db'
import schema from './schema'
import userResolver from './resolvers/users'
import todoResolver from './resolvers/todos'
import cors from 'cors'

initDB()

const app = express()
app.use(cors())

const root = {
  ...userResolver,
  ...todoResolver,
}

app.use('/graphql', graphqlHTTP({
  schema: schema,
  rootValue: root,
  graphiql: true,
}))

const port = process.env.PORT ?? 3001
app.listen(port, () => {
  console.log(`Now browse to localhost:${port}/graphql`)
})