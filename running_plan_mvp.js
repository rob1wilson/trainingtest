// Running Plan MVP Prototype (Flexible Duration)
// Features: 10-question form, flexible-week plan generator, chat feature (rules-based)
// File type: React

import React, { useState } from 'react';

const questions = [
  { id: 1, text: 'Goal (e.g., 5k, 10k, half marathon)' },
  { id: 2, text: 'Experience level (Beginner, Intermediate, Advanced)' },
  { id: 3, text: 'Weekly availability (hours)' },
  { id: 4, text: 'Current weekly mileage' },
  { id: 5, text: 'Longest run currently' },
  { id: 6, text: 'Preferred training days' },
  { id: 7, text: 'Any injuries or limitations' },
  { id: 8, text: 'Preferred run type (easy, intervals, long run)' },
  { id: 9, text: 'Target race date' },
  { id: 10, text: 'Other notes/preferences' },
  { id: 11, text: 'Desired plan length (weeks, 4-16)' }
];

function App() {
  const [answers, setAnswers] = useState({});
  const [plan, setPlan] = useState(null);
  const [chatLog, setChatLog] = useState([]);
  const [chatInput, setChatInput] = useState('');

  const handleChange = (id, value) => {
    setAnswers(prev => ({ ...prev, [id]: value }));
  };

  const generatePlan = () => {
    const durationInput = parseInt(answers[11], 10);
    const duration = Number.isNaN(durationInput) ? 16 : Math.min(Math.max(durationInput, 4), 16);

    const weeks = [];
    for (let w = 1; w <= duration; w++) {
      weeks.push({
        week: w,
        longRun: `${5 + w} km`,
        easyRuns: 2,
        intervalSessions: w % 3 === 0 ? 1 : 0
      });
    }
    setPlan(weeks);
  };

  const sendChat = () => {
    if (!chatInput.trim()) return;
    const userMessage = { sender: 'you', text: chatInput.trim() };
    let botMessage = { sender: 'chat', text: '' };

    const lowerInput = chatInput.toLowerCase();
    if (lowerInput.includes('missed')) {
      botMessage.text = 'No problem. Reduce next week’s long run by 10% and keep your easy runs consistent.';
    } else if (lowerInput.includes('too hard')) {
      botMessage.text = 'Try lowering the intensity or swapping an interval session for an easy run.';
    } else {
      botMessage.text = 'Thanks for your message! Adjustments will be considered in your upcoming weeks.';
    }

    setChatLog(prev => [...prev, userMessage, botMessage]);
    setChatInput('');
  };

  return (
    <div style={{ padding: '2rem', fontFamily: 'Arial' }}>
      <h1>🏃 Running Plan Generator (React)</h1>

      {!plan && (
        <div>
          <h2>Answer the Questions</h2>
          {questions.map(q => (
            <div key={q.id} style={{ margin: '0.5rem 0' }}>
              <label>{q.text}: </label>
              <input type="text" onChange={e => handleChange(q.id, e.target.value)} />
            </div>
          ))}
          <button onClick={generatePlan} style={{ marginTop: '1rem' }}>Generate Plan</button>
        </div>
      )}

      {plan && (
        <div>
          <h2>Your {plan.length}-Week Plan</h2>
          <table border="1" cellPadding="5" style={{ borderCollapse: 'collapse', width: '100%', marginTop: '1rem' }}>
            <thead>
              <tr>
                <th>Week</th>
                <th>Long Run</th>
                <th>Easy Runs</th>
                <th>Interval Sessions</th>
              </tr>
            </thead>
            <tbody>
              {plan.map(w => (
                <tr key={w.week}>
                  <td>{w.week}</td>
                  <td>{w.longRun}</td>
                  <td>{w.easyRuns}</td>
                  <td>{w.intervalSessions}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <h3>Chat</h3>
      <div style={{ border: '1px solid #ccc', padding: '1rem', height: '200px', overflowY: 'auto', marginBottom: '0.5rem' }}>
        {chatLog.map((c, i) => (
          <div key={i} style={{ textAlign: c.sender === 'you' ? 'right' : 'left' }}>
            <b>{c.sender}:</b> {c.text}
          </div>
        ))}
      </div>
      <input
        type="text"
        value={chatInput}
        onChange={e => setChatInput(e.target.value)}
        style={{ width: '80%', marginRight: '0.5rem' }}
        onKeyDown={e => e.key === 'Enter' && sendChat()}
      />
      <button onClick={sendChat}>Send</button>
    </div>
  );
}

export default App;
