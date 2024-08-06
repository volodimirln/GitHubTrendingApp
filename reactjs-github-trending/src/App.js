import React, { useState, useEffect } from 'react';
import axios from 'axios';

const apiBaseUrl = 'http://localhost:5500';

function App() {
  const [repositories, setRepositories] = useState([]);

  useEffect(() => {
    axios.get(`${apiBaseUrl}/repositories`)
      .then(response => {
        setRepositories(response.data);
      })
      .catch(error => {
        console.error('Error fetching repositories:', error);
      });
  }, []);

  const startSync = () => {
    axios.post(`${apiBaseUrl}/sync`)
      .then(() => {
        console.log('Sync started.');
      })
      .catch(error => {
        console.error('Error starting sync:', error);
      });
  };

  const forceSync = () => {
    axios.post(`${apiBaseUrl}/sync/force`)
      .then(() => {
        console.log('Forced sync completed.');
      })
      .catch(error => {
        console.error('Error forcing sync:', error);
      });
  };

  return (
    <div className="App">
      <h1>Trending GitHub Repositories</h1>
      <button onClick={startSync}>Start Sync</button>
      <button onClick={forceSync}>Force Sync</button>
      <ul>
        {repositories.map(repo => (
          <li key={repo.Id}>
            <a href={repo.URL} target="_blank" rel="noopener noreferrer">{repo.Name}</a> - {repo.Stars} stars
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;