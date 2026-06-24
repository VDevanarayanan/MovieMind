import { Request, Response, NextFunction } from 'express';
import { login, signup } from '../services/authService';

export const signupHandler = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { username, email, password } = req.body;
    const payload = await signup(username, email, password);
    res.status(201).json(payload);
  } catch (error) {
    next(error);
  }
};

export const loginHandler = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email, password } = req.body;
    const payload = await login(email, password);
    res.json(payload);
  } catch (error) {
    next(error);
  }
};
