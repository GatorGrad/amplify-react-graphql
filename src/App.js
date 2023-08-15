import React, { useState } from 'react';
import './App.css';
import axios from 'axios';
import { Amplify, Auth } from 'aws-amplify';
import config from './aws-exports';
import { withAuthenticator, Button, Heading, Image, View, Card } from '@aws-amplify/ui-react';
Amplify.configure(config);

const GameTable = ({ game, selectedWinner, onChange }) => {
  return (
    <table className="custom-table">
      <thead>
        <tr>
          <th>Select</th>
          <th>Team</th>
          <th>Final Score</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>
            <input
              type="radio"
              name={`game${game.homeTeam}`}
              value={game.homeTeam}
              checked={selectedWinner === game.homeTeam}
              onChange={() => onChange(game, game.homeTeam)}
            />
          </td>
          <td>{game.homeTeam}</td>
          <td>{game.homeScore}</td>
        </tr>
        <tr>
          <td>
            <input
              type="radio"
              name={`game${game.awayTeam}`}
              value={game.awayTeam}
              checked={selectedWinner === game.awayTeam}
              onChange={() => onChange(game, game.awayTeam)}
            />
          </td>
          <td>{game.awayTeam}</td>
          <td>{game.awayScore}</td>
        </tr>
      </tbody>
      <tfoot>
        <tr>
          <td>
            <Button onClick={() => submitPick(game, selectedWinner)}>
              Submit Pick
            </Button>
          </td>
        </tr>
      </tfoot>
    </table>
  );
};

const submitPick = async (game, selectedWinner) => {
  const response = await axios.post('/picks', {
    gameId: game.id,
    winner: selectedWinner,
  });

  if (response.status === 200) {
    alert('Pick submitted successfully!');
  } else {
    alert('An error occurred while submitting your pick.');
  }
};
const App = () => {
  const [games, setGames] = useState([
    // Game 1
    {
      homeTeam: 'Panthers',
      homeScore: '',
      awayTeam: 'Cardinals',
      awayScore: '',
    },
    // Game 2
    {
      homeTeam: 'Jets',
      homeScore: '',
      awayTeam: 'Bills',
      awayScore: '',
    },
    // Add more games here...
    // Game 3
    {
      homeTeam: 'Team A',
      homeScore: '',
      awayTeam: 'Team B',
      awayScore: '',
    },
    // Game 4
    {
      homeTeam: 'Team X',
      homeScore: '',
      awayTeam: 'Team Y',
      awayScore: '',
    },
    // Game 5
    {
      homeTeam: 'Team M',
      homeScore: '',
      awayTeam: 'Team N',
      awayScore: '',
    },
    // Game 6
    {
      homeTeam: 'Team O',
      homeScore: '',
      awayTeam: 'Team P',
      awayScore: '',
    },
    // Game 7
    {
      homeTeam: 'Team O',
      homeScore: '',
      awayTeam: 'Team P',
      awayScore: '',
    },
    // Game 8
    {
      homeTeam: 'Team O',
      homeScore: '',
      awayTeam: 'Team P',
      awayScore: '',
    },
    // Game 9
    {
      homeTeam: 'Team O',
      homeScore: '',
      awayTeam: 'Team P',
      awayScore: '',
    },
    // Game 10
    {
      homeTeam: 'Team O',
      homeScore: '',
      awayTeam: 'Team P',
      awayScore: '',
    },
    // Add more games here...
  ]);
  const [winners, setWinners] = useState(Array(games.length).fill(null));

  const handleGameWinnerSelect = (selectedGame, selectedWinner) => {
    const gameIndex = games.indexOf(selectedGame);
    setWinners((prevWinners) => {
      const updatedWinners = [...prevWinners];
      updatedWinners[gameIndex] =
        updatedWinners[gameIndex] === selectedWinner ? null : selectedWinner;
      return updatedWinners;
    });
  };

  const handleSignOut = async () => {
    try {
      await Auth.signOut();
    } catch (error) {
      console.log('Error signing out: ', error);
    }
  };

  return (
    <div>
      <h1>2023 NFL and College Football Schedule</h1>

      <div className="app-container">
        <div className="game-column">
          <h2>NFL Week 1</h2>
          {games.slice(0, Math.ceil(games.length / 2)).map((game, index) => (
            <div key={index}>
              <GameTable
                game={game}
                selectedWinner={winners[index]}
                onChange={(selectedGame, selectedWinner) =>
                  handleGameWinnerSelect(selectedGame, selectedWinner, index)
                }
              />
            </div>
          ))}
        </div>

        <div className="game-column">
          <h2>College Football Week 1</h2>
          {games.slice(Math.ceil(games.length / 2)).map((game, index) => (
            <div key={index}>
              <GameTable
                game={game}
                selectedWinner={winners[index + Math.ceil(games.length / 2)]}
                onChange={(selectedGame, selectedWinner) =>
                  handleGameWinnerSelect(selectedGame, selectedWinner, index + Math.ceil(games.length / 2))
                }
              />
            </div>
          ))}
        </div>
      </div>

      <h3>Selected Winners:</h3>
      <ul>
        {winners.map((winner, index) => (
          <li key={index}>{winner ? winner : 'No winner selected'}</li>
        ))}
      </ul>

      <Button onClick={handleSignOut}>Sign Out</Button>
    </div>
  );
};

export default withAuthenticator(App);