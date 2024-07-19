import express, { Request, Response } from 'express';
import { Point } from '../models/point';
import { getDataManagerInstance } from '../data/dataManager';

const router = express.Router();
export default router;

router.get('/api/points', async (_req: Request, res: Response) => {
  try {
    const points = await getDataManagerInstance().getPoints();
    return res.status(200).json(points.map((p) => ({ ...p })));
  } catch (err: any) {
    return res.status(500).json({ message: err.message });
  }
});

router.post('/api/points', async (req: Request, res: Response) => {
  try {
    const point: Point = {
      id: req.body.id,
      name: req.body.name,
      created: new Date()
    };

    const savedPoint = await getDataManagerInstance().addPoint(point);

    return res.status(201).json(savedPoint);
  } catch (err: any) {
    return res.status(400).json({ message: err.message });
  }
});
