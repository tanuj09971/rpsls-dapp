# Rock-Paper-Scissor-Lizard-Spock Game

## Overview

This project is a decentralized application (DApp) that enables users to play an extended version of Rock-Paper-Scissors (RPS) on the Ethereum blockchain. The game involves additional weapons such as Lizard and Spock.

## Features

- **Create Game:** Allows a party to create an RPS game, commit a move, select another player, and stake ETH.
- **Join Game:** Enables the second party to pay an equal amount of ETH and choose their move.
- **Resolve Game:** The first party reveals their move, and the smart contract distributes the ETH based on the winner or splits them in case of a tie.
- **Timeouts:** Implements timeouts to handle scenarios where a party stops responding.

## Getting Started

Follow these steps to run the project locally:

1. **Install Dependencies:**
   ```bash
   npm install
   ```

2. **Run the Application:**
   ```bash
   npm run dev
   ```
   The application will be available at [http://localhost:3000](http://localhost:3000).

3. **Connect with MetaMask:**
   Ensure MetaMask is installed in your browser and connected to the Ethereum testnet ie Goerli.


## Security Considerations

- **Smart Contract Security:** The provided smart contract is not modified. Ensure that it is secure against potential attacks.
- **Salt Handling:** Properly handle the salt to prevent attacks from parties trying to manipulate the game.

## Development Environment

- **Next.js:** The project is built using Next.js for server-side rendering (not currently used in the dapp) and easy React development.
- **TypeScript:** The codebase is written in TypeScript for enhanced type safety.
- **Web3.js:** Web3.js is used to interact with the Ethereum blockchain and smart contract.

## Notes

- The application assumes only two parties playing the game.
- The design is minimalistic for demonstration purposes.

## Mixed Strategy Nash Equilibria

The Mixed Strategy Nash Equilibrium (MSNE) of a game is a probability distribution over the possible strategies of each player, such that no player has an incentive to unilaterally change their strategy given the distribution of others. In simpler terms, it's a situation where each player randomizes their actions and no player has an incentive to deviate from their strategy.

A strategy profile is a set of strategies, one for each player. Informally, a strategy profile is a Nash equilibrium if no player can do better by unilaterally changing their strategy. To see what this means, imagine that each player is told the strategies of the others. Suppose then that each player asks themselves: "Knowing the strategies of the other players, and treating the strategies of the other players as set in stone, can I benefit by changing my strategy?"

For instance if a player prefers "Yes", then that set of strategies is not a Nash equilibrium. But if every player prefers not to switch (or is indifferent between switching and not) then the strategy profile is a Nash equilibrium.


|              | **Rock** | **Paper** | **Scissor** | **Lizard** | **Spock**    |
|--------------|----------|-----------|--------------|------------|--------------|
| **Rock**     | 0,0      | -1,1      | 1,-1         | 1,-1       | -1,1         |
| **Paper**    | 1,-1     | 0,0       | -1,1         | -1,1       | 1,-1         |
| **Scissors** | -1,1     | 1,-1      | 0,0          | 1,-1       | -1,1         |
| **Lizard**   | -1,1     | 1,-1      | -1,1         | 0,0        | 1,-1         |
| **Spock**    | 1,-1     | -1,1      | 1,-1         | -1,1       | 0,0          |


Each player’s set of possible actions is denoted A = {Rock, Paper, Scissor, Lizard, Spock}

First I prove that the strategy profile
((1/5, 1/5, 1/5, 1/5, 1/5), (1/5, 1/5, 1/5, 1/5, 1/5)) is a mixed Nash equilibrium. If player j plays pj = (1/5, 1/5, 1/5, 1/5, 1/5), then player i’s expected payoff from each of the three actions equals 0.

EUi (ai,(1/5, 1/5, 1/5, 1/5, 1/5))

= (1/5) × 0 + (1/5) × (-1) + (1/5) × (1) + (1/5) × (1) + (1/5) × (-1) 

= 0 for all ai ∈ A.