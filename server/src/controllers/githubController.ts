import { Request, Response } from 'express';
import axios from 'axios';

const clientId = process.env.GITHUB_CLIENT_ID!;
const clientSecret = process.env.GITHUB_CLIENT_SECRET!;

// Redirect to GitHub OAuth page
export const loginWithGithub = (_: Request, res: Response): void => {
    const clientId = process.env.GITHUB_CLIENT_ID!;
    const redirectUri = `${process.env.BACKEND_URL}/github/callback`;
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
        res.redirect(`${process.env.FRONTEND_URL}/?githubAccessToken=${accessToken}`);
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

export const getAccessToken = async (code: string): Promise<string> => {
    try {
        const response = await axios.post(
            'https://github.com/login/oauth/access_token',
            {
                client_id: process.env.GITHUB_CLIENT_ID,
                client_secret: process.env.GITHUB_CLIENT_SECRET,
                code,
            },
            { headers: { Accept: 'application/json' } }
        );

        if (response.data.error) {
            throw new Error(`GitHub OAuth Error: ${response.data.error_description}`);
        }
        return response.data.access_token;
    } catch (error) {
        console.error('Error fetching access token:', error);
        throw new Error('Failed to exchange code for access token.');
    }
};


// Function to get user data
export const getUserData = async (token: string) => {
    const userResponse = await axios.get('https://api.github.com/user', {
        headers: { Authorization: `Bearer ${token}` },
    });

    const eventsResponse = await axios.get(`https://api.github.com/users/${userResponse.data.login}/events`, {
        headers: { Authorization: `Bearer ${token}` },
    });

    const contributions = getContributions(eventsResponse.data);

    const reposResponse = await axios.get(`https://api.github.com/users/${userResponse.data.login}/repos`, {
        headers: { Authorization: `Bearer ${token}` },
        params: { sort: 'updated', per_page: 4 },
    });

    const repos = reposResponse.data;

    return {
        login: userResponse.data.login,
        avatar_url: userResponse.data.avatar_url,
        followers: userResponse.data.followers,
        following: userResponse.data.following,
        contributions,
        mostStarredRepo: await getMostStarredRepo(repos),
        languagesUsed: getLanguagesUsed(repos),
        totalForkCount: getTotalForkCount(repos),
        publicRepos: getPublicReposCount(repos),
        privateRepos: getPrivateReposCount(repos),
        lastUpdatedRepos: getLastUpdatedRepos(repos),
    };
};

// Function to get contributions count
const getContributions = (events: any[]) => {
    return events.filter((event: any) =>
        ['PushEvent', 'PullRequestEvent', 'IssuesEvent'].includes(event.type)
    ).length;
};

// Function to get the most starred repository
const getMostStarredRepo = async (repos: any[]) => {
    const sortedByStars = repos.sort((a, b) => b.stargazers_count - a.stargazers_count);
    const mostStarredRepo = sortedByStars[0];
    return {
        name: mostStarredRepo.name,
        stars: mostStarredRepo.stargazers_count,
        url: mostStarredRepo.html_url,
    };
};

// Function to get unique languages used in repositories
const getLanguagesUsed = (repos: any[]) => {
    return repos.map(repo => repo.language).filter((value, index, self) => self.indexOf(value) === index);
};

// Function to get total fork count across all repositories
const getTotalForkCount = (repos: any[]) => {
    return repos.reduce((sum, repo) => sum + repo.forks_count, 0);
};

// Function to get count of public repositories
const getPublicReposCount = (repos: any[]) => {
    return repos.filter(repo => !repo.private).length;
};

// Function to get count of private repositories
const getPrivateReposCount = (repos: any[]) => {
    return repos.filter(repo => repo.private).length;
};

// Function to get last updated details of repositories
const getLastUpdatedRepos = (repos: any[]) => {
    return repos.map(repo => ({
        name: repo.name,
        updated_at: repo.updated_at,
    }));
};