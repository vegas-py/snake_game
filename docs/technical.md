# Snake Game Technical Documentation

## Project Structure

```
snake_game/
├── app.py                 # Flask server and API endpoints
├── requirements.txt       # Python dependencies
├── static/               # Static files
│   ├── game.js          # Game logic
│   ├── style.css        # Styles
│   └── audio/           # Audio files
│       ├── background.mp3
│       ├── eat.mp3
│       └── gameover.mp3
└── templates/
    └── index.html       # Main HTML template
```

## Components

### Backend (app.py)
- Flask server for serving static files
- API endpoints for high score management
- In-memory score storage (can be extended to database)

### Frontend (game.js)
- `Snake` class for game logic management
- `AudioManager` class for sound management
- Game state management system (menu, game, pause, settings)
- User input handling

### Sound System
- Background music with volume control
- Sound effects for game events
- Separate controls for music and effects
- Sound testing functionality

### Interface
- Main menu with options
- Game screen with score counter
- High score table
- Sound settings
- Responsive design

## API Endpoints

### GET /scores
Отримання списку найкращих результатів
```json
{
    "scores": [
        {
            "player": "Player1",
            "score": 100,
            "date": "2025-05-16 12:00:00"
        }
    ]
}
```

### POST /scores
Додавання нового результату
```json
{
    "player": "Player1",
    "score": 100
}
```

## Клавіші керування

- **↑** - рух вгору
- **↓** - рух вниз
- **←** - рух вліво
- **→** - рух вправо
- **Space** - пауза
- **M** - вимкнення/увімкнення звуку

## Sound Settings

### Background Music
- Volume control (0-100%)
- Test button
- Automatic start/stop during gameplay

### Sound Effects
- Volume control (0-100%)
- Test button
- Event sounds:
  - Food collection
  - Game over

## Extending Functionality

### Adding New Sounds
1. Add MP3 sound file to the `static/audio/` folder
2. Register new sound in the `AudioManager` class
3. Create playback method
4. Add volume control if needed

### Adding New Features
1. For backend - add new route in `app.py`
2. For frontend - modify `game.js`
3. Update interface in `index.html`
4. Add styles in `style.css`

## Known Issues and Solutions

### Sound Issues
- If sound doesn't play, check file format (MP3)
- Some browsers require user interaction before playing audio

### Performance Issues
- During long gameplay, speed might decrease - recommended to clean unused resources
- Large number of high scores might slow down loading - limit the number of records
