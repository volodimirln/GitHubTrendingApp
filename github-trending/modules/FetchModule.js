const { PrismaClient } = require('@prisma/client');
const axios = require('axios');
const prisma = new PrismaClient();

class FetchModule {
    axios;
    prisma;
    constructor() {
        var axios = require('axios');
        this.axios = axios;
        this.prisma = new PrismaClient();
    }

    async syncRepositoriesForce(res, syncInterval) {
        try {
            clearInterval(syncInterval);
            await this.fetchTrendingRepositories();
            syncInterval = setInterval(this.fetchTrendingRepositories, 1000 * 60 * 2);
            res.status(200).send('Forced sync completed.');
        } catch {
            res.status(500).json("Error sync");
        }
    }

    async syncRepositories(res) {
        try {
            await this.fetchTrendingRepositories();
            res.status(200).send('Sync started.');
        } catch {
            res.status(500).json("Error server");
        }
    }

    async getRepositoryByName(req, res) {
        try {
            const repository = await prisma.repositories.findUnique({
                where: { Name: req.params.name },
            });
            if (repository) {
                res.json(repository);
            } else {
                res.status(404).send('Repository not found.');
            }
        } catch {
            res.status(500).json("Error server");
        }
    }

    async getRepositoryById(req, res) {
        try {
            const repository = await prisma.repositories.findUnique({
                where: { Id: parseInt(req.params.id) },
            });
            if (repository) {
                res.json(repository);
            } else {
                res.status(404).send('Repository not found.');
            }
        } catch {
            res.status(500).json("Error server");
        }
    }

    async getRepositories(res) {
        try {
            const repositories = await prisma.repositories.findMany();
            res.status(200).json(repositories);
        } catch {
            res.status(500).json("Error server");
        }
    }

    async fetchTrendingRepositories() {
        try {
            const response = await axios.get('https://api.github.com/search/repositories', {
                params: {
                    q: 'stars:>1',
                    sort: 'stars',
                    order: 'desc',
                },
            });

            const repos = response.data.items.map(repo => ({
                Name: repo.name,
                URL: repo.html_url,
                Stars: repo.stargazers_count,
            }));

            for (const repo of repos) {
                await prisma.repositories.upsert({
                    where: { Name: repo.Name },
                    update: repo,
                    create: repo,
                });
            }
            console.log('Repositories synced successfully.');
        } catch (error) {
            console.error('Error fetching trending repositories:', error);
        }
    }
}
module.exports = FetchModule;