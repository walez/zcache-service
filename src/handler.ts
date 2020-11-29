import { Request, Response } from 'express';
import { isArray, isEmpty } from 'lodash';
import Cache from './cache';

export default class Handler {
  constructor(private cache: Cache) {}

  getItems(req: Request, res: Response): void {
    const { keys } = req.query;
    if (!isArray(keys)) {
      res
        .status(400)
        .json({ message: 'Invalid Request: Array of keys expected' });
      return;
    }

    try {
      const result = this.cache.get(keys as string[]);
      res.json(result);
    } catch (error) {
      console.error(`issue processing getItems: ${error.message}`);
      res.status(400).json({ message: 'Issue processing request' });
    }
  }

  putItems(req: Request, res: Response): void {
    const item = req.body;
    if (isEmpty(item)) {
      res.status(400).json({
        message: 'Invalid Request: Array of key/value pairs expected',
      });
      return;
    }
    const result = this.cache.set(item);
    res.json(result);
  }

  deleteItems(req: Request, res: Response): void {
    const items = req.body;
    if (isEmpty(items)) {
      res.status(400).json({
        message: 'Invalid Request: Array of key/value pairs expected',
      });
      return;
    }
    const result = this.cache.delete(items);
    res.json(result);
  }
}
