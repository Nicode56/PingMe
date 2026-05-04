import { useCallback, useEffect, useRef, useState } from "react";
import "./App.css";

const APP_CONFIG = {
  name: import.meta.env.VITE_APP_NAME || "SetPing",
  soundEnabled: import.meta.env.VITE_SOUND_ENABLED !== "false",
  shareEnabled: import.meta.env.VITE_SHARE_ENABLED !== "false",
  timeRemindersEnabled: import.meta.env.VITE_TIME_REMINDERS_ENABLED !== "false",
  maxReminders: parseInt(import.meta.env.VITE_MAX_REMINDERS) || 100,
};

function getSavedReminders() {
  const saved = localStorage.getItem("reminders");
  return saved ? JSON.parse(saved) : [];
}

function App() {
  const [task, setTask] = useState("");
  const [time, setTime] = useState("");
  const [reminders, setReminders] = useState(getSavedReminders);
  const [alertReminder, setAlertReminder] = useState(null);
  const audioContextRef = useRef(null);
  const soundLoopRef = useRef(null);

  // ✅ FIX: persist reminders
  useEffect(() => {
    localStorage.setItem("reminders", JSON.stringify(reminders));
  }, [reminders]);

  const addReminder = () => {
    if (!task.trim()) return;

    if (reminders.length >= APP_CONFIG.maxReminders) return;

    const newReminder = {
      id: Date.now(),
      task: task.trim(),
      dueTime: time || null,
      triggered: false,
      completed: false,
    };

    setReminders([...reminders, newReminder]);
    setTask("");
    setTime("");
  };

  const toggleComplete = (id) => {
    setReminders(
      reminders.map((r) =>
        r.id === id
          ? { ...r, completed: !r.completed, triggered: false }
          : r
      )
    );
  };

  const deleteReminder = (id) => {
    setReminders(reminders.filter((r) => r.id !== id));
  };

  const triggerReminder = useCallback(
    (id) => {
      const reminder = reminders.find((r) => r.id === id);
      if (!reminder || reminder.completed) return;

      setAlertReminder(reminder);

      setReminders((prev) =>
        prev.map((r) =>
          r.id === id ? { ...r, triggered: true } : r
        )
      );
    },
    [reminders]
  );

  // time-based checking
  useEffect(() => {
    const interval = setInterval(() => {
      const now = Date.now();

      reminders.forEach((reminder) => {
        if (reminder.completed || !reminder.dueTime) return;

        const due = new Date(reminder.dueTime).getTime();
        if (due <= now && !reminder.triggered) {
          triggerReminder(reminder.id);
        }
      });
    }, 5000);

    return () => clearInterval(interval);
  }, [reminders, triggerReminder]);

  return (
    <div className="container">
      <h1>{APP_CONFIG.name} 🔔</h1>

      <p className="app-description">
        A reminder system designed to help you complete tasks when and where they matter most.
      </p>

      <div className="task-mode">
        <span className="active">Time-Based</span>
      </div>

      <button className="future-feature-button" disabled>
        Location-Based (Coming Soon)
      </button>

      {/* INPUT */}
      <div className="input-group">
        <input
          type="text"
          placeholder="What do you need to remember?"
          value={task}
          onChange={(e) => setTask(e.target.value)}
        />
        <button onClick={addReminder}>Save</button>
      </div>

      {/* TIME INPUT */}
      <div className="field-grid">
        <input
          type="datetime-local"
          value={time}
          onChange={(e) => setTime(e.target.value)}
        />
      </div>

      {/* LIST */}
      <div className="list-container">
        <h2>Saved reminders</h2>

        {reminders.length === 0 ? (
          <p className="empty-state">
            No tasks yet. Add something you don’t want to forget.
          </p>
        ) : (
          <ul>
            {reminders.map((r) => (
              <li
                key={r.id}
                className={`${r.completed ? "done" : ""} ${
                  r.triggered ? "alert-item" : ""
                }`}
              >
                <div className="reminder-row">
                  <div onClick={() => toggleComplete(r.id)}>
                    <div className="reminder-text">{r.task}</div>
                    {r.dueTime && (
                      <div className="reminder-details">
                        Due {new Date(r.dueTime).toLocaleString()}
                      </div>
                    )}
                  </div>

                  <button onClick={() => deleteReminder(r.id)}>✕</button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* ALERT */}
      {alertReminder && (
        <div className="alert-modal">
          <div className="modal-card">
            <h2>🔔 Reminder</h2>
            <p>{alertReminder.task}</p>
            <button onClick={() => setAlertReminder(null)}>Got it</button>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
