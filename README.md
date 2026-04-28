* Smart Agro: Disease & Fertilizer Recommendation System
Smart Agro is a full-stack AI-driven platform designed to help farmers identify crop diseases and get precise fertilizer recommendations. By leveraging the Gemini API and the MERN stack, the system provides real-time analysis and multi-language support to bridge the gap between technology and traditional farming.

* Key Features
AI Disease Detection: Upload images of infected crops to receive instant diagnosis via Gemini AI.

Smart Fertilizer Recommendations: Get tailored suggestions based on crop type and soil conditions.

Multi-language Support: Accessible in English, Hindi, and Marathi to support local farmers.

Farming Calendar & Weather: Integrated tools to help plan agricultural activities based on local weather.

Market Insights: Real-time information on market trends and crop prices.

Admin Dashboard: Comprehensive management system for users and agricultural data.

* Tech Stack
Frontend: React.js, TypeScript, Vite, Tailwind CSS

Backend: Node.js, Express.js

Database: MongoDB

AI Engine: Google Gemini API

Other Tools: i18next (Internationalization), Axios, Lucide React (Icons)

* Installation & Setup
Clone the repository:

Bash
git clone https://github.com/PARI-KSHIT/Smart-Agro.git
Install Backend Dependencies:

Bash
cd backend
npm install
Install Frontend Dependencies:

Bash
cd ../frontend
npm install
Environment Variables:
Create a .env file in the backend folder and add:

Code snippet
MONGO_URI=your_mongodb_connection_string
GEMINI_API_KEY=your_google_gemini_key
PORT=5000
Run the Application:

Backend: npm run dev (inside /backend)

Frontend: npm run dev (inside /frontend)

📸 Screenshots
(Tip: Add a screenshot of your Dashboard or AI Assistant here later to make it visually appealing!)

📝 License
This project is for educational purposes as part of my MCA curriculum.
