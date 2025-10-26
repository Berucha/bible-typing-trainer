import { useState, useEffect, useRef } from 'react'
import './App.css'

// Bible verses for typing practice
const bibleVerses = [
  {
    text: "For God so loved the world that he gave his one and only Son, that whoever believes in him shall not perish but have eternal life.",
    reference: "John 3:16"
  },
  {
    text: "I can do all things through Christ who strengthens me.",
    reference: "Philippians 4:13"
  },
  {
    text: "Trust in the Lord with all your heart and lean not on your own understanding; in all your ways submit to him, and he will make your paths straight.",
    reference: "Proverbs 3:5-6"
  },
  {
    text: "The Lord is my shepherd, I lack nothing. He makes me lie down in green pastures, he leads me beside quiet waters, he refreshes my soul.",
    reference: "Psalm 23:1-3"
  },
  {
    text: "Be strong and courageous. Do not be afraid; do not be discouraged, for the Lord your God will be with you wherever you go.",
    reference: "Joshua 1:9"
  },
  {
    text: "And we know that in all things God works for the good of those who love him, who have been called according to his purpose.",
    reference: "Romans 8:28"
  },
  {
    text: "But the fruit of the Spirit is love, joy, peace, forbearance, kindness, goodness, faithfulness, gentleness and self-control.",
    reference: "Galatians 5:22-23"
  },
  {
    text: "Love is patient, love is kind. It does not envy, it does not boast, it is not proud.",
    reference: "1 Corinthians 13:4"
  }
]

function App() {
  const [currentVerseIndex, setCurrentVerseIndex] = useState(0)
  const [userInput, setUserInput] = useState('')
  const [startTime, setStartTime] = useState(null)
  const [isComplete, setIsComplete] = useState(false)
  const [wpm, setWpm] = useState(0)
  const [accuracy, setAccuracy] = useState(100)
  const inputRef = useRef(null)

  const currentVerse = bibleVerses[currentVerseIndex]
  const targetText = currentVerse.text

  useEffect(() => {
    // Focus input on mount and verse change
    if (inputRef.current && !isComplete) {
      inputRef.current.focus()
    }
  }, [currentVerseIndex, isComplete])

  const handleInputChange = (e) => {
    const value = e.target.value

    // Start timer on first character
    if (!startTime && value.length === 1) {
      setStartTime(Date.now())
    }

    setUserInput(value)

    // Check if typing is complete
    if (value === targetText) {
      setIsComplete(true)
      calculateStats(value)
    } else if (value.length <= targetText.length) {
      // Calculate accuracy in real-time
      const correctChars = value.split('').filter((char, index) => char === targetText[index]).length
      const currentAccuracy = value.length > 0 ? Math.round((correctChars / value.length) * 100) : 100
      setAccuracy(currentAccuracy)

      // Calculate WPM in real-time
      if (startTime) {
        const timeElapsed = (Date.now() - startTime) / 1000 / 60 // in minutes
        const wordsTyped = value.trim().split(/\s+/).length
        const currentWpm = timeElapsed > 0 ? Math.round(wordsTyped / timeElapsed) : 0
        setWpm(currentWpm)
      }
    }
  }

  const calculateStats = (finalText) => {
    if (!startTime) return

    const timeElapsed = (Date.now() - startTime) / 1000 / 60 // in minutes
    const wordsTyped = finalText.trim().split(/\s+/).length
    const calculatedWpm = Math.round(wordsTyped / timeElapsed)
    
    const correctChars = finalText.split('').filter((char, index) => char === targetText[index]).length
    const calculatedAccuracy = Math.round((correctChars / finalText.length) * 100)

    setWpm(calculatedWpm)
    setAccuracy(calculatedAccuracy)
  }

  const nextVerse = () => {
    setCurrentVerseIndex((prevIndex) => (prevIndex + 1) % bibleVerses.length)
    resetTyping()
  }

  const resetTyping = () => {
    setUserInput('')
    setStartTime(null)
    setIsComplete(false)
    setWpm(0)
    setAccuracy(100)
  }

  const getCharacterClass = (index) => {
    if (index >= userInput.length) {
      return 'char-pending'
    }
    return userInput[index] === targetText[index] ? 'char-correct' : 'char-incorrect'
  }

  return (
    <div className="app">
      <header className="header">
        <h1>Bible Typing Trainer</h1>
        <p className="subtitle">Improve your typing skills while reflecting on Scripture</p>
      </header>

      <main className="main-content">
        <div className="stats-bar">
          <div className="stat">
            <span className="stat-label">WPM</span>
            <span className="stat-value">{wpm}</span>
          </div>
          <div className="stat">
            <span className="stat-label">Accuracy</span>
            <span className="stat-value">{accuracy}%</span>
          </div>
          <div className="stat">
            <span className="stat-label">Progress</span>
            <span className="stat-value">{userInput.length}/{targetText.length}</span>
          </div>
        </div>

        <div className="verse-display">
          <div className="verse-text">
            {targetText.split('').map((char, index) => (
              <span key={index} className={getCharacterClass(index)}>
                {char}
              </span>
            ))}
          </div>
          <div className="verse-reference">{currentVerse.reference}</div>
        </div>

        <div className="input-section">
          <textarea
            ref={inputRef}
            className="typing-input"
            value={userInput}
            onChange={handleInputChange}
            placeholder="Start typing the verse above..."
            disabled={isComplete}
            spellCheck={false}
          />
        </div>

        {isComplete && (
          <div className="completion-message">
            <h2>Well Done! 🎉</h2>
            <p>You completed this verse with {accuracy}% accuracy at {wpm} WPM!</p>
            <div className="button-group">
              <button onClick={nextVerse} className="btn-primary">
                Next Verse
              </button>
              <button onClick={resetTyping} className="btn-secondary">
                Try Again
              </button>
            </div>
          </div>
        )}

        {!isComplete && (
          <div className="button-group">
            <button onClick={nextVerse} className="btn-secondary">
              Skip to Next Verse
            </button>
            <button onClick={resetTyping} className="btn-secondary">
              Reset
            </button>
          </div>
        )}
      </main>

      <footer className="footer">
        <p>Practice daily to improve your typing speed and accuracy</p>
      </footer>
    </div>
  )
}

export default App
