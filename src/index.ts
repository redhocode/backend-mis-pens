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
import { requireAdmin, requireUser } from './middleware/auth'
// import user, { accessValidation } from './apps/user/user'
import academicController from './apps/academic/academic.controller'
import scholarshipController from './apps/scholarship/scholarship.controller'
import { AuthRouter } from './apps/user/auth.router'

dotenv.config()
// Load environment variables based on environment (development or production)
if (process.env.NODE_ENV === 'development') {
  dotenv.config({ path: '.env.dev' })
} else {
  dotenv.config({ path: '.env.prod' })
}
const app: Application = express()
const PORT = process.env.PORT

app.use(bodyParser.json({ limit: '50mb' }))
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }))
app.use(express.json())
app.use(express.static('public'))

app.use(
  cors({
    origin: process.env.CORS_ORIGIN, // Allow requests from this origin
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'], // Allow these methods
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'X-Auth-Token', 'Origin'], // Allow these headers
    credentials: true // Allow credentials (cookies, authorization headers)
  })
)

app.use(deserializedToken)
// Set additional CORS headers for preflight requests
app.options('*', cors())
app.get('/api', (req: Request, res: Response) => {
  res.send('Hello World! this is backend-mis-pens')
})

app.use('/products', productController)
app.use('/academics', academicController)
app.use(`/students`, studentController)
app.use('/users',AuthRouter)
app.use('/activitys', activityController)
app.use('/scholarships', scholarshipController)
app.listen(PORT, () => {
  logger.info(`Server running on port: ${PORT}`)
})
