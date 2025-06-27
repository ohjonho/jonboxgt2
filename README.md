# 🎯 Trivia Murder Party

A multiplayer trivia game with minigames, real-time competition, and AI opponents!

## 🚀 Live Demo

[Play the game here!](https://yourusername.github.io/jonbox_gt3)

## 🎮 Features

- **Multiplayer Support**: Real-time multiplayer using Supabase
- **AI Opponents**: Add computer players with different difficulty levels
- **Minigames**: Hunting Season, Quantum Leap, Resource Race, Dice Duel, Codebreaker
- **Offline Mode**: Play with AI when multiplayer is unavailable
- **Responsive Design**: Works on desktop and mobile devices

## 🛠️ Setup

### Prerequisites
- A Supabase account (free tier works fine)
- Basic knowledge of HTML/JavaScript

### 1. Supabase Setup

1. Create a free account at [supabase.com](https://supabase.com)
2. Create a new project
3. Go to SQL Editor and run these commands:

```sql
-- Create rooms table
CREATE TABLE rooms (
    id SERIAL PRIMARY KEY,
    code VARCHAR(6) UNIQUE NOT NULL,
    status VARCHAR(20) DEFAULT 'waiting',
    created_at TIMESTAMP DEFAULT NOW()
);

-- Create players table
CREATE TABLE players (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    room_code VARCHAR(6) REFERENCES rooms(code) ON DELETE CASCADE,
    username VARCHAR(50) NOT NULL,
    is_host BOOLEAN DEFAULT FALSE,
    score INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT NOW()
);

-- Create games table (optional, for advanced features)
CREATE TABLE games (
    id SERIAL PRIMARY KEY,
    room_code VARCHAR(6) REFERENCES rooms(code) ON DELETE CASCADE,
    state JSONB,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Enable Row Level Security (RLS)
ALTER TABLE rooms ENABLE ROW LEVEL SECURITY;
ALTER TABLE players ENABLE ROW LEVEL SECURITY;
ALTER TABLE games ENABLE ROW LEVEL SECURITY;

-- Create policies (allow all operations for demo)
CREATE POLICY "Allow all operations on rooms" ON rooms FOR ALL USING (true);
CREATE POLICY "Allow all operations on players" ON players FOR ALL USING (true);
CREATE POLICY "Allow all operations on games" ON games FOR ALL USING (true);
```

### 2. Update Configuration

Edit `core.js` and update the Supabase configuration:

```javascript
const CONFIG = {
    SUPABASE_URL: 'https://your-project-id.supabase.co',
    SUPABASE_ANON_KEY: 'your-anon-key-here',
    // ... other config
};
```

### 3. Deploy to GitHub Pages

1. Push your code to GitHub
2. Go to your repository settings
3. Scroll down to "GitHub Pages"
4. Select "Deploy from a branch"
5. Choose "main" branch and "/ (root)" folder
6. Click "Save"

Your game will be available at: `https://yourusername.github.io/jonbox_gt3`

## 🎯 How to Play

1. **Create a Room**: Click "Create Room" and enter your username
2. **Share Room Code**: Share the 6-character room code with friends
3. **Add AI Players**: Add computer opponents with different difficulty levels
4. **Start Game**: Begin the trivia competition with minigames!

## 🧪 Testing

Use `test-multiplayer.html` to test the multiplayer functionality:
- Test Supabase connection
- Test room creation and joining
- Test player synchronization

## 🔧 Alternative Hosting Options

### Netlify (Free)
1. Connect your GitHub repository to Netlify
2. Deploy automatically on every push

### Vercel (Free)
1. Connect your GitHub repository to Vercel
2. Deploy automatically on every push

### Traditional Web Hosting
Upload all files to your web server's public directory.

## 🐛 Troubleshooting

### Multiplayer Not Working?
1. Check Supabase connection in browser console
2. Verify your Supabase URL and API key
3. Ensure database tables are created correctly
4. Check RLS policies are set to allow operations

### Game Not Loading?
1. Check browser console for JavaScript errors
2. Ensure all files are uploaded correctly
3. Verify file paths in HTML

## 📝 License

This project is open source and available under the [MIT License](LICENSE).

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📞 Support

If you encounter any issues, please:
1. Check the troubleshooting section above
2. Open an issue on GitHub
3. Check the browser console for error messages 