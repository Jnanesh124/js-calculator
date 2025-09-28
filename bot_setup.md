
# 🤖 Telegram Bot Setup Instructions

## Step 1: Create Your Telegram Bot

1. Open Telegram and search for `@BotFather`
2. Start a chat with BotFather and send `/newbot`
3. Choose a name for your bot (e.g., "MovieStream Bot")
4. Choose a username for your bot (e.g., "moviestream_upload_bot")
5. Copy the bot token that BotFather gives you

## Step 2: Set Up Environment Variables

1. In Replit, click on the "Secrets" tab (🔒) in the sidebar
2. Add a new secret:
   - Key: `TELEGRAM_BOT_TOKEN`
   - Value: Your bot token from BotFather

## Step 3: Install Dependencies and Start the Bot

1. Run this command to install dependencies:
   ```bash
   npm install
   ```

2. Start the bot server:
   ```bash
   npm start
   ```

3. Your website will still run on port 5000, and the bot server runs on port 3000

## Step 4: Test Your Bot

1. Go to your bot in Telegram
2. Send `/start` to see the welcome message
3. Use `/addmovie` to add a new movie:
   - Send movie title
   - Send genre (e.g., "Action • Adventure")
   - Send rating (e.g., 8.5)
   - Send poster image
   - Send description

## Bot Commands

- `/start` - Welcome message and instructions
- `/addmovie` - Add a new movie to your website
- `/listmovies` - View all uploaded movies
- `/help` - Show help information

## How It Works

1. **Upload via Telegram**: Send movie details through the bot
2. **Automatic Website Update**: The bot automatically updates your website
3. **File Storage**: Movie posters are saved to `attached_assets/uploaded_movies/`
4. **Data Persistence**: Movie information is stored in `movies_data.json`

## Features

✅ Add movies through Telegram
✅ Automatic website updates
✅ Image upload and storage
✅ Movie data persistence
✅ Real-time website refresh
✅ Mobile-friendly bot interface

Your users can now upload movies directly through Telegram, and they'll automatically appear on your website!
