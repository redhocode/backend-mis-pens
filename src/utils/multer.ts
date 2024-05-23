import express, { Request, Response } from 'express'
import multer from 'multer'
import path from 'path'

export const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'public/images/') // Updated path
  },
  filename: function (req, file, cb) {
    cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname))
  }
})
