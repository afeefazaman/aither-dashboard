import { Router } from 'express';
import { loginWithGithub, githubCallback, getGithubStats } from '../controllers/githubController';

const router = Router();

router.get('/login', loginWithGithub);
router.get('/callback', githubCallback);
router.get('/stats', getGithubStats);

export default router;
