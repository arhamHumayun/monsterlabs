# MonsterLabs

MonsterLabs is an AI-powered tool for Dungeons & Dragons players and Dungeon Masters to instantly generate creatures and magic items. It lets you customize monsters and items, generates detailed stat blocks, and creates unique images, all in seconds.
This is hosted at [Monsterlabs.app](https://monsterlabs.app)

> **Note:** This project is **archived** and no longer maintained. The code is provided as-is for reference, learning, or experimentation. It contains many outdated libraries and methods.

---

## Features

- **AI-Generated Creatures** – Create unique monsters with detailed stat blocks.
- **AI-Generated Magic Items** – Generate balanced, lore-friendly items for your campaign.
- **Customization** – Tweak monster stats, abilities, and lore before finalizing.
- **Image Generation** – Automatically create original creature/item art.
- **Fast & Easy** – Designed to speed up prep time for DMs.

---

## Tech Stack

- **Framework:** [Next.js](https://nextjs.org/)
- **Language:** TypeScript
- **Backend/DB/Auth:** Supabase
- **Styling:** Tailwind CSS
- **AI Integration:** OpenAI API
- **Hosting:** Vercel

---

## Getting Started

```bash
# 1. Clone the repo
git clone https://github.com/arhamHumayun/monsterlabs.git
cd monsterlabs

# 2. Install dependencies
bun i

# 3. Set environment variables
# Create a .env.local file and add your API keys
OPENAI_API_KEY=your_openai_api_key
OTHER_API_KEYS=...

# 4. Run the dev server
bun run dev

# 5. Open your browser
http://localhost:3000
