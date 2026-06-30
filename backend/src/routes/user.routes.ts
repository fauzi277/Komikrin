import express, { Router, Response, NextFunction } from 'express';
import pool from '../config/database';
import authMiddleware, { AuthRequest } from '../middleware/auth';
import { AppError } from '../middleware/errorHandler';

const router: Router = express.Router();

// Get user profile
router.get('/profile', authMiddleware, async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const result = await pool.query(
      'SELECT id, email, nama, created_at FROM users WHERE id = $1',
      [req.user?.id]
    );

    if (result.rows.length === 0) {
      return next(new AppError('User tidak ditemukan', 404));
    }

    res.json({
      success: true,
      data: result.rows[0]
    });
  } catch (error) {
    next(error);
  }
});

// Add to favorites
router.post('/favorit/:komik_id', authMiddleware, async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const { komik_id } = req.params;

    // Check if already favorited
    const existing = await pool.query(
      'SELECT * FROM favorit WHERE user_id = $1 AND komik_id = $2',
      [req.user?.id, komik_id]
    );

    if (existing.rows.length > 0) {
      return next(new AppError('Sudah di favorit', 400));
    }

    await pool.query(
      'INSERT INTO favorit (user_id, komik_id, created_at) VALUES ($1, $2, NOW())',
      [req.user?.id, komik_id]
    );

    res.json({
      success: true,
      message: 'Ditambahkan ke favorit'
    });
  } catch (error) {
    next(error);
  }
});

// Get favorites
router.get('/favorit', authMiddleware, async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const result = await pool.query(
      'SELECT k.* FROM komik k JOIN favorit f ON k.id = f.komik_id WHERE f.user_id = $1 ORDER BY f.created_at DESC',
      [req.user?.id]
    );

    res.json({
      success: true,
      data: result.rows
    });
  } catch (error) {
    next(error);
  }
});

export default router;
