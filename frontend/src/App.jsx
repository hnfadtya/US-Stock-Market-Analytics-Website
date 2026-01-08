import { useState } from 'react'

function App() {
    return (
        <div className="app">
            <header className="header">
                <h1>Stock Dashboard</h1>
                <p>Real-time Stock Market Data & Analytics</p>
            </header>

            <main className="main">
                <div className="container">
                    <h2>Setup Complete!</h2>
                    <p>Backend API: <code>{import.meta.env.VITE_API_URL}</code></p>
                    <p>Ready to build amazing features!</p>
                </div>
            </main>
        </div>
    )
}

export default App