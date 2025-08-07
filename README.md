<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
</head>
<body>

  <h1>📞 CallSenseAI — Find Top Customer Problems from Calls</h1>

  <h2>🧠 Problem Statement</h2>
  <p>Many businesses struggle to identify common customer issues buried in hours of support call recordings. Manual review is slow and inefficient. There's a need for an automated system to extract and prioritize frequent issues from customer conversations.</p>

  <h2>🚀 How It Works</h2>
  <ul>
    <li>Upload call audio files (e.g., <code>.mp3</code>, <code>.wav</code>)</li>
    <li>Convert audio into text using speech-to-text APIs like AssemblyAI</li>
    <li>Analyze the transcripts to extract recurring keywords or phrases</li>
    <li>Display a ranked list of the top 5–10 most frequent customer issues</li>
  </ul>

  <h2>⚙ Tech Stack Used</h2>
  <table>
    <tr>
      <th>Category</th>
      <th>Technologies Used</th>
    </tr>
    <tr>
      <td><strong>AI & ML</strong></td>
      <td>AssemblyAI, OpenAI, Natural Language Processing (NLP)</td>
    </tr>
    <tr>
      <td><strong>Frontend</strong></td>
      <td>React, Next.js, TypeScript, Tailwind CSS</td>
    </tr>
    <tr>
      <td><strong>Backend</strong></td>
      <td>Node.js, API Routes, Server Actions</td>
    </tr>
    <tr>
      <td><strong>Infrastructure</strong></td>
      <td>Vercel, Cloud APIs, Real-time Processing</td>
    </tr>
  </table>

  <h2>🛠 Setup Instructions (How to Run It)</h2>
  <h3>1. Download the Project</h3>
  <p>Click the <em>"Download Code"</em> button or clone via Git.</p>

  <h3>2. Open in VS Code</h3>
  <pre><code>cd your-project-folder
code .</code></pre>

  <h3>3. Install Dependencies</h3>
  <pre><code>npm install
# or
yarn install
# or
pnpm install</code></pre>

  <h3>4. Set Up Environment Variables</h3>
  <pre><code># .env.local
ASSEMBLYAI_API_KEY=your_assemblyai_key_here
OPENAI_API_KEY=your_openai_key_here</code></pre>

  <h3>5. Run the Dev Server</h3>
  <pre><code>npm run dev</code></pre>

  <h3>6. Open in Browser</h3>
  <p>Visit: <a href="http://localhost:3000">http://localhost:3000</a></p>

  <h2>📁 Project Structure</h2>
  <pre><code>callsense-ai/
├── app/
│   ├── api/
│   ├── globals.css
│   ├── layout.tsx
│   └── page.tsx
├── components/
├── contexts/
├── lib/
├── .env.local
├── package.json
└── next.config.js</code></pre>

  <h2>🧩 Recommended VS Code Extensions</h2>
  <ul>
    <li>ES7+ React/Redux Snippets</li>
    <li>Tailwind CSS IntelliSense</li>
    <li>Prettier - Code Formatter</li>
    <li>TypeScript Importer</li>
  </ul>

  <h2>✅ Testing the App</h2>
  <h3>Admin Login</h3>
  <ul>
    <li>Email: <code>admin@callsenseai.com</code></li>
    <li>Password: <code>admin123</code></li>
  </ul>

  <h3>User Registration</h3>
  <ul>
    <li>Register new users via UI</li>
    <li>Upload audio files and test transcription</li>
    <li>Check admin dashboard</li>
  </ul>

  <h2>🧠 Features to Test</h2>
  <ol>
    <li>Authentication System (Login / Register)</li>
    <li>Audio Upload (.mp3, .wav)</li>
    <li>Real-time Transcription</li>
    <li>AI-based Issue Detection</li>
    <li>Admin Dashboard & Analytics</li>
    <li>Dark / Light Mode</li>
    <li>Mobile Responsive Layout</li>
  </ol>

  <h2>👨‍💻 Team Members</h2>
  <ul>
    <li>Het Knjariya (Leader)</li>
    <li>Maulik Pandor</li>
    <li>Chirag Khandala</li>
    <li>Hardik Vanza</li>
  </ul>

</body>
</html>