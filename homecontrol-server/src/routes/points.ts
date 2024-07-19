import express, { Request, Response } from 'express';
import { Point } from '../models/point';
import { getDataManagerInstance } from '../data/dataManager';

const router = express.Router();
export default router;

declare namespace Express {
  export interface Request {
    user?: string;
  }
}

router.get('/api/points', async (req: Request, res: Response) => {
  try {
    const points = await getDataManagerInstance().getPoints();
    res.status(200).json(points.map((p) => ({ ...p })));
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
});

router.post('/api/points', async (request: Request /* request */, response: Response) => {
  try {
    const point: Point = {
      id: request.body.id,
      name: request.body.name,
      created: new Date()
    };

    const savedPoint = await getDataManagerInstance().addPoint(point);

    response.status(201).json(savedPoint);
  } catch (err: any) {
    response.status(400).json({ message: err.message });
  }
});
