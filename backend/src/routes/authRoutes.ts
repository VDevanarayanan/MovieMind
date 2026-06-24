import { Router } from 'express';
import { loginHandler, signupHandler } from '../controllers/authController';
import { validateBody } from '../middleware/validate';
import { signupSchema, loginSchema } from '../schemas/authSchemas';

const router = Router();

router.post('/signup', validateBody(signupSchema), signupHandler);
router.post('/login', validateBody(loginSchema), loginHandler);

export default router;
