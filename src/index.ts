import express, { Application, Request, Response } from 'express'
import dotenv from 'dotenv'
import cors from 'cors'
import productController from './apps/product/product.controller'
import studentController from './apps/student/student.controller'
import activityController from './apps/activity/activity.controller'
import { logger } from './utils/logger'
import bodyParser from 'body-parser'
// import userController from "./apps/user/user.controller";
import deserializedToken from './middleware/deseliarizedToken'
import { requireUser } from './middleware/auth'
import user, { accessValidation } from './apps/user/user'
import academicController from './apps/academic/academic.controller'
import scholarshipController from './apps/scholarship/scholarship.controller'

dotenv.config()

const app: Application = express()
const PORT = process.env.PORT || 3000

app.use(bodyParser.urlencoded({ extended: false }))
app.use(express.json())
app.use(bodyParser.json())
app.use(
  cors({
    origin: 'http://localhost:3000', // Allow requests from this origin
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'], // Allow these methods
    allowedHeaders: ['Content-Type', 'Authorization'], // Allow these headers
    credentials: true // Allow credentials (cookies, authorization headers)
  })
)

// Set additional CORS headers for preflight requests
app.options('*', cors())
app.get('/api', (req: Request, res: Response) => {
  res.send('Hello World!')
})

app.use('/products', productController)
app.use('/academics', academicController)
app.use(`/students`, studentController)
app.use('/users', user)
app.use('/activitys', activityController)
app.use('/scholarships', scholarshipController)
app.listen(PORT, () => {
  logger.info(`Server running on port: ${PORT}`)
})
