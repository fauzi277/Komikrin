import express, { Router, Response, NextFunction } from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import pool from '../config/database';
import authMiddleware, { AuthRequest } from '../middleware/auth';
import { AppError } from '../middleware/errorHandler';

const router: Router = express.Router();

// Create uploads folder if not exists
const uploadsDir = path.join(__dirname, '../../uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Multer config
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadsDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({ storage, limits: { fileSize: 52428800 } });

// Get all komik
router.get('/', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { page = 1, limit = 12, search, genre } = req.query;
    const offset = (Number(page) - 1) * Number(limit);

    let query = 'SELECT * FROM komik WHERE 1=1';
    const params: any[] = [];

    if (search) {
      query += ' AND (judul ILIKE $' + (params.length + 1) + ' OR deskripsi ILIKE $' + (params.length + 1) + ')';
      params.push(`%${search}%`);
    }

    if (genre) {
      query += ' AND genre = $' + (params.length + 1);
      params.push(genre);
    }

    query += ' ORDER BY created_at DESC LIMIT $' + (params.length + 1) + ' OFFSET $' + (params.length + 2);
    params.push(limit, offset);

    const result = await pool.query(query, params);
    const countResult = await pool.query('SELECT COUNT(*) FROM komik');

    res.json({
      success: true,
      data: result.rows,
      pagination: {
        page,
        limit,
        total: parseInt(countResult.rows[0].count)
      }
    });
  } catch (error) {
    next(error);
  }
});

// Get komik by ID
router.get('/:id', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;

    const result = await pool.query(
      'SELECT * FROM komik WHERE id = $1',
      [id]
    );

    if (result.rows.length === 0) {
      return next(new AppError('Komik tidak ditemukan', 404));
    }

    res.json({
      success: true,
      data: result.rows[0]
    });
  } catch (error) {
    next(error);
  }
});

// Upload komik (creator/admin)
router.post(
  '/',
  authMiddleware,
  upload.single('cover'),
  async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const { judul, deskripsi, genre, author, status } = req.body;
      const cover = req.file ? `/uploads/${req.file.filename}` : null;

      if (!judul || !deskripsi) {
        return next(new AppError('Judul dan deskripsi harus diisi', 400));
      }

      const result = await pool.query(
        'INSERT INTO komik (judul, deskripsi, genre, author, status, cover, user_id, created_at) VALUES ($1, $2, $3, $4, $5, $6, $7, NOW()) RETURNING *',
        [judul, deskripsi, genre || 'Umum', author, status || 'Ongoing', cover, req.user?.id]
      );

      res.status(201).json({
        success: true,
        message: 'Komik berhasil diupload',
        data: result.rows[0]
      });
    } catch (error) {
      next(error);
    }
  }
);

export default router;
