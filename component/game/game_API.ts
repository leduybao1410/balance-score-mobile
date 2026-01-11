// Get API base URL from environment variable (React Native/Expo)
// In Expo, use EXPO_PUBLIC_ prefix for environment variables
// Or configure via app.json/constants
const HOST_API = process.env.EXPO_PUBLIC_HOST_API || process.env.HOST_API || 'http://localhost:3000';

export const createGame = async (gameId: string, playerArr: any[]) => {
  try {
    const response = await fetch(`${HOST_API}/api/game/create`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ gameId, players: playerArr }), // Send both gameId and players
    });

    if (!response.ok) {
      throw new Error(`Error: ${response.statusText}`);
    }

    const data = await response.json();

    console.log("✅ Game Created:", data); // Logs game creation response

    return data; // Return data for further processing

  } catch (error: any) {
    console.error("❌ Error creating game:", error);
    throw error;
  }
};


export const updateGame = async (gameTokenId: string, playerArr: any[]) => {
  try {

    const response = await fetch(`${HOST_API}/api/game/update`, {
      headers: {
        'Content-Type': 'application/json',
      },
      method: 'PUT',
      body: JSON.stringify({ gameTokenId, players: playerArr })
    });
    if (response.ok) {
      const data = await response.json();
      console.log(data); // age, player, sessionToken }
      return response;
    }
  } catch (error: any) {
    console.error("❌ Error updating game:", error);
    throw error;
  }
};

export type gameDataType = {
  players: [];
  playerKey: string;
}

export const getGame = async () => {
  try {
    const response = await fetch(`${HOST_API}/api/game/get`, {
      method: "GET",
      headers: {
        'Content-Type': 'application/json',
      }
    });
    if (response.ok) {
      const res = await response.json();
      console.log('Get response:', res)
      return res;
    }
  } catch (error: any) {
    console.error("❌ Error getting game:", error);
    throw error;
  }
};