import { Request, Response } from 'express';
import { getAccessToken, getUserData } from '../services/githubService';

// Redirect to GitHub OAuth page
export const loginWithGithub = (_: Request, res: Response): void => {
  const clientId = process.env.GITHUB_CLIENT_ID!;
const redirectUri = `${process.env.BACKEND_URL}/api/github/callback`;
const githubAuthUrl = `https://github.com/login/oauth/authorize?client_id=${clientId}&redirect_uri=${redirectUri}&scope=read:user,user:email`;
  res.redirect(githubAuthUrl);
};

// GitHub callback to exchange code for access token
export const githubCallback = async (req: Request, res: Response): Promise<void> => {
  const { code } = req.query;

  if (!code) {
    res.status(400).send('Missing authorization code.');
    return;
  }

  try {
    const accessToken = await getAccessToken(code as string);
    res.redirect(`${process.env.FRONTEND_URL}/dashboard?token=${accessToken}`);
  } catch (error) {
    console.error('GitHub OAuth error:', error);
    res.status(500).send('Authentication failed.');
  }
};

// Fetch user stats from GitHub API
export const getGithubStats = async (req: Request, res: Response): Promise<void> => {
  const token = req.headers.authorization?.split(' ')[1];

  if (!token) {
    res.status(401).send('Unauthorized.');
    return;
  }

  try {
    const userData = await getUserData(token);
    res.json(userData);
  } catch (error) {
    console.error('Error fetching GitHub stats:', error);
    res.status(500).send('Failed to fetch GitHub data.');
  }
};