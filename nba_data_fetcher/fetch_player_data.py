# nba_data_fetcher/fetch_player_data.py
import json
from nba_api.stats.static import players

# Fetch all players
all_players = players.get_players()

# Filter and save relevant information
player_data = {}
for player in all_players:
    player_data[player['full_name']] = {
        'id': player['id'],  # Numeric ID for headshot
        'first_name': player['first_name'],
        'last_name': player['last_name']
    }

# Save to JSON file
with open('player_data.json', 'w') as f:
    json.dump(player_data, f, indent=4)

print("Player data with numeric IDs has been saved to player_data.json")
