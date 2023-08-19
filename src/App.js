import React, { useState } from 'react';
import './App.css';
import axios from 'axios';
import { Amplify, Auth, API } from 'aws-amplify';
import config from './aws-exports';
import { withAuthenticator, Button } from '@aws-amplify/ui-react';
import * as mutations from './graphql/mutations';
Amplify.configure(config);

const allWeeksGames = [
  [
    // Week 1 games
    {
      homeTeam: 'Panthers',
      homeScore: '',
      awayTeam: 'Cardinals',
      awayScore: '',
    },
    {
      homeTeam: 'Jets',
      homeScore: '',
      awayTeam: 'Bills',
      awayScore: '',
    },
    // ... Add more games for Week 1 ...
  ],
  [
    // Week 2 games
    {
      homeTeam: 'Team A',
      homeScore: '',
      awayTeam: 'Team B',
      awayScore: '',
    },
    {
      homeTeam: 'Team X',
      homeScore: '',
      awayTeam: 'Team Y',
      awayScore: '',
    },
    // ... Add more games for Week 2 ...
  ],
  // ... Add more weeks of games ...
  [
    // Week 2 games
    {
      homeTeam: 'Team A',
      homeScore: '',
      awayTeam: 'Team B',
      awayScore: '',
    },
    {
      homeTeam: 'Team X',
      homeScore: '',
      awayTeam: 'Team Y',
      awayScore: '',
    },
    // ... Add more games for Week 2 ...
  ],
  [
    // Week 2 games
    {
      homeTeam: 'Team A',
      homeScore: '',
      awayTeam: 'Team B',
      awayScore: '',
    },
    {
      homeTeam: 'Team X',
      homeScore: '',
      awayTeam: 'Team Y',
      awayScore: '',
    },
    // ... Add more games for Week 2 ...
  ],
  [
    // Week 2 games
    {
      homeTeam: 'Team A',
      homeScore: '',
      awayTeam: 'Team B',
      awayScore: '',
    },
    {
      homeTeam: 'Team X',
      homeScore: '',
      awayTeam: 'Team Y',
      awayScore: '',
    },
    // ... Add more games for Week 2 ...
  ],
];



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

const submitPick = async () => {
  try {
    const user = await Auth.currentAuthenticatedUser();
    const username = user.username;

    const input = {
      username: username,
    };

    const response = await API.graphql({
      query: mutations.updateSelection,
      variables: { input },
    });

    console.log('Selection submitted:', response.data.updateSelection);
    alert('Username submitted successfully!');
  } catch (error) {
    console.error('Error submitting username:', error);
    console.log('Response:', error.response); // Log the response for further investigation
    alert('An error occurred while submitting the username.');
  }
  
};


const App = () => {
  const [currentWeek, setCurrentWeek] = useState(0);
  const [winners, setWinners] = useState(Array(allWeeksGames[currentWeek].length).fill(null));

  const handleNextWeek = () => {
    if (currentWeek < allWeeksGames.length - 1) {
      setCurrentWeek(currentWeek + 1);
      setWinners(Array(allWeeksGames[currentWeek + 1].length).fill(null));
    }
  };

  const handlePreviousWeek = () => {
    if (currentWeek > 0) {
      setCurrentWeek(currentWeek - 1);
      setWinners(Array(allWeeksGames[currentWeek - 1].length).fill(null));
    }
  };

  const handleGameWinnerSelect = (selectedGame, selectedWinner, gameIndex) => {
    setWinners((prevWinners) => {
      const updatedWinners = [...prevWinners];
      updatedWinners[gameIndex] = updatedWinners[gameIndex] === selectedWinner ? null : selectedWinner;
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
      <h1>Make Your Picks!</h1>

      <Button onClick={handlePreviousWeek}>Previous Week</Button>
      <Button onClick={handleNextWeek}>Next Week</Button>

      <div className="app-container">
        <div className="game-column">
          <h2>NFL Week {currentWeek + 1}</h2>
          {allWeeksGames[currentWeek].slice(0, Math.ceil(allWeeksGames[currentWeek].length / 2)).map((game, index) => (
            <div key={index}>
              {/* Render GameTable component here */}
              <GameTable
                game={game}
                gameIndex={index} // Pass the index as a prop
                selectedWinner={winners[index]}
                onChange={(selectedGame, selectedWinner) =>
                  handleGameWinnerSelect(selectedGame, selectedWinner, index)
                }
                submitPick={submitPick} // Pass submitPick function as a prop
              />
            </div>
          ))}
        </div>

        <div className="game-column">
          <h2>College Football Week {currentWeek + 1}</h2>
          {allWeeksGames[currentWeek].slice(Math.ceil(allWeeksGames[currentWeek].length / 2)).map((game, index) => (
            <div key={index}>
              {/* Render GameTable component here */}
              <GameTable
                game={game}
                gameIndex={index + Math.ceil(allWeeksGames[currentWeek].length / 2)} // Adjust index
                selectedWinner={winners[index + Math.ceil(allWeeksGames[currentWeek].length / 2)]}
                onChange={(selectedGame, selectedWinner) =>
                  handleGameWinnerSelect(selectedGame, selectedWinner, index + Math.ceil(allWeeksGames[currentWeek].length / 2))
                }
                submitPick={submitPick} // Pass submitPick function as a prop
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

      {/* Moved the Submit Picks button here */}
      <Button onClick={handleSignOut}>Sign Out</Button>
    </div>
  );
};

export default withAuthenticator(App);