import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import prisma from '../prisma/client';
import { config } from '../config';

export const signup = async (username: string, email: string, password: string) => {
  const existing = await prisma.user.findFirst({ where: { OR: [{ email }, { username }] } });
  if (existing) {
    throw new Error('Username or email already in use');
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  const user = await prisma.user.create({
    data: { username, email, password: hashedPassword },
  });

  return {
    token: jwt.sign({ userId: user.id, email: user.email }, config.jwtSecret, { expiresIn: '7d' }),
    user: { id: user.id, username: user.username, email: user.email, createdAt: user.createdAt },
  };
};

export const login = async (email: string, password: string) => {
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) {
    throw new Error('Invalid credentials');
  }

  const matched = await bcrypt.compare(password, user.password);
  if (!matched) {
    throw new Error('Invalid credentials');
  }

  return {
    token: jwt.sign({ userId: user.id, email: user.email }, config.jwtSecret, { expiresIn: '7d' }),
    user: { id: user.id, username: user.username, email: user.email, createdAt: user.createdAt },
  };
};
