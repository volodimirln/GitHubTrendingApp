const axios = require('axios');
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

const apiBaseUrl = 'http://localhost:5500';

async function startCLI() {
  console.log('CLI Client for GitHub Trending Repositories');
  console.log('1. Get all repositories');
  console.log('2. Get repository by name');
  console.log('3. Get repository by ID');
  console.log('4. Start sync with GitHub');
  console.log('5. Force sync');

  rl.question('Choose an option: ', async (option) => {
    switch (option) {
      case '1':
        try {
          const response = await axios.get(`${apiBaseUrl}/repositories`);
          const repos = response.data;
          if (Array.isArray(repos) && repos.length > 0) {
            repos.forEach(repo => {
              console.log(`ID: ${repo.Id}, Name: ${repo.Name}, Stars: ${repo.Stars}, URL: ${repo.URL}`);
            });
          } else {
            console.log('No repositories found.');
          }
        } catch (error) {
          console.error('Error fetching repositories:', error.message);
        }
        rl.close();
        break;

      case '2':
        rl.question('Enter repository name: ', async (name) => {
          try {
            const response = await axios.get(`${apiBaseUrl}/repository/${name}`);
            const repo = response.data;
            if (repo) {
              console.log(`ID: ${repo.Id}, Name: ${repo.Name}, Stars: ${repo.Stars}, URL: ${repo.URL}`);
            } else {
              console.log('Repository not found.');
            }
          } catch (error) {
            console.error('Error fetching repository by name:', error.message);
          }
          rl.close();
        });
        break;

      case '3':
        rl.question('Enter repository ID: ', async (id) => {
          try {
            const response = await axios.get(`${apiBaseUrl}/repositories/${id}`);
            const repo = response.data;
            if (repo) {
              console.log(`ID: ${repo.Id}, Name: ${repo.Name}, Stars: ${repo.Stars}, URL: ${repo.URL}`);
            } else {
              console.log('Repository not found.');
            }
          } catch (error) {
            console.error('Error fetching repository by ID:', error.message);
          }
          rl.close();
        });
        break;

      case '4':
        try {
          await axios.post(`${apiBaseUrl}/sync`);
          console.log('Sync started.');
        } catch (error) {
          console.error('Error starting sync:', error.message);
        }
        rl.close();
        break;

      case '5':
        try {
          await axios.post(`${apiBaseUrl}/sync/force`);
          console.log('Forced sync completed.');
        } catch (error) {
          console.error('Error forcing sync:', error.message);
        }
        rl.close();
        break;

      default:
        console.log('Invalid option');
        rl.close();
        break;
    }
  });
}

startCLI();