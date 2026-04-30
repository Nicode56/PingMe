import { useCallback, useEffect, useRef, useState } from "react";
import "./App.css";

// Environment variables with defaults
const APP_CONFIG = {
  name: import.meta.env.VITE_APP_NAME || "SetPing",
  version: import.meta.env.VITE_APP_VERSION || "1.0.0",
  soundEnabled: import.meta.env.VITE_SOUND_ENABLED !== "false",
  shareEnabled: import.meta.env.VITE_SHARE_ENABLED !== "false",
  timeRemindersEnabled: import.meta.env.VITE_TIME_REMINDERS_ENABLED !== "false",
  maxReminders: parseInt(import.meta.env.VITE_MAX_REMINDERS) || 100,
};

function getSavedReminders() {
  const saved = localStorage.getItem("reminders");
  return saved ? JSON.parse(saved) : [];
}

function getInitialReminders() {
  const saved = getSavedReminders();
  if (typeof window === "undefined") return saved;

  const params = new URLSearchParams(window.location.search);
  const sharePayload = params.get("share");
  if (!sharePayload) return saved;

  const decoded = decodeReminderData(sharePayload);
  if (decoded && decoded.task) {
    params.delete("share");
    window.history.replaceState({}, "", window.location.pathname);
    return [
      ...saved,
      {
        ...decoded,
        id: Date.now(),
        triggered: false,
        completed: false,
      },
    ];
  }

  return saved;
}

function formatTime(value) {
  if (!value) return "";
  const date = new Date(value);
  return date.toLocaleString([], {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

function encodeReminderData(reminder) {
  const json = JSON.stringify(reminder);
  return btoa(unescape(encodeURIComponent(json)));
}

function decodeReminderData(encoded) {
  try {
    const json = decodeURIComponent(escape(atob(encoded)));
    return JSON.parse(json);
  } catch {
    return null;
  }
}

function playPingMeTone(ctx = null) {
  if (!APP_CONFIG.soundEnabled) return ctx || null;

  const AudioContext = window.AudioContext || window.webkitAudioContext;
  if (!AudioContext) return null;
  
  const audioContext = ctx || new AudioContext();
  const now = audioContext.currentTime;

  const pulse = audioContext.createOscillator();
  const rumble = audioContext.createOscillator();
  const gain = audioContext.createGain();

  pulse.type = "square";
  rumble.type = "triangle";
  rumble.frequency.value = 90;

  gain.gain.setValueAtTime(0.0001, now);
  gain.gain.exponentialRampToValueAtTime(0.35, now + 0.02);
  gain.gain.exponentialRampToValueAtTime(0.08, now + 0.28);
  gain.gain.exponentialRampToValueAtTime(0.001, now + 1.2);

  pulse.frequency.setValueAtTime(880, now);
  pulse.frequency.linearRampToValueAtTime(720, now + 0.18);
  pulse.frequency.linearRampToValueAtTime(980, now + 0.4);

  rumble.connect(gain);
  pulse.connect(gain);
  gain.connect(audioContext.destination);

  pulse.start(now);
  rumble.start(now);
  pulse.stop(now + 1.1);
  rumble.stop(now + 1.05);

  return audioContext;
}

function App() {
  const [task, setTask] = useState("");
  const [time, setTime] = useState("");
  const [reminders, setReminders] = useState(getInitialReminders);
  const [alertReminder, setAlertReminder] = useState(() => {
    const saved = getSavedReminders();
    const uncompletedReminders = saved.filter(reminder => !reminder.completed);
    if (uncompletedReminders.length > 0) {
      const reminder = uncompletedReminders[0];
      return { ...reminder, triggerReason: "persistent" };
    }
    return null;
  });
  const hasCheckedOnMount = useRef(false);
  const audioContextRef = useRef(null);
  const soundLoopRef = useRef(null);
  const [shareNote, setShareNote] = useState(() => {
    if (typeof window === "undefined") return "";
    const params = new URLSearchParams(window.location.search);
    const payload = params.get("share");
    return payload && decodeReminderData(payload) ? "Imported shared reminder." : "";
  });
  const [importValue, setImportValue] = useState("");
  const [importError, setImportError] = useState("");

  useEffect(() => {
    // Play sound if alertReminder is set on mount
    if (alertReminder && !hasCheckedOnMount.current) {
      hasCheckedOnMount.current = true;
      audioContextRef.current = playPingMeTone(audioContextRef.current);
      
      // Start looping sound
      if (APP_CONFIG.soundEnabled) {
        soundLoopRef.current = setInterval(() => {
          audioContextRef.current = playPingMeTone(audioContextRef.current);
        }, 1500);
      }
    }

    return () => {
      if (soundLoopRef.current) {
        clearInterval(soundLoopRef.current);
        soundLoopRef.current = null;
      }
    };
  }, [alertReminder]);

  const triggerReminder = useCallback(
    (id, reason) => {
      setReminders((current) =>
        current.map((reminder) =>
          reminder.id === id ? { ...reminder, triggered: true } : reminder
        )
      );

      const reminder = reminders.find((reminder) => reminder.id === id);
      if (reminder) {
        setAlertReminder({ ...reminder, triggerReason: reason });
        playPingMeTone();
      }
    },
    [reminders]
  );

  useEffect(() => {
    const interval = setInterval(() => {
      const now = Date.now();

      reminders.forEach((reminder) => {
        if (reminder.completed) return;
        if (reminder.snoozedUntil && reminder.snoozedUntil > now) return;

        let shouldAlert = false;
        let reason = "time";

        if (APP_CONFIG.timeRemindersEnabled && reminder.dueTime) {
          const dueMs = new Date(reminder.dueTime).getTime();
          if (!Number.isNaN(dueMs) && dueMs <= now) {
            shouldAlert = true;
            reason = "time";
          }
        }

        if (shouldAlert) {
          triggerReminder(reminder.id, reason);
        }
      });
    }, 5000);

    return () => clearInterval(interval);
  }, [reminders, triggerReminder]);

  const addReminder = () => {
    if (!task.trim()) return;

    // Check max reminders limit
    if (reminders.length >= APP_CONFIG.maxReminders) {
      setShareNote(`Maximum of ${APP_CONFIG.maxReminders} reminders allowed.`);
      return;
    }

    const newReminder = {
      id: Date.now(),
      task: task.trim(),
      dueTime: time || null,
      triggered: false,
      snoozedUntil: null,
      completed: false,
    };

    setReminders([...reminders, newReminder]);
    setTask("");
    setTime("");
  };

  const toggleComplete = (id) => {
    const reminder = reminders.find((reminder) => reminder.id === id);
    const toggledCompleted = reminder ? !reminder.completed : false;

    setReminders(
      reminders.map((reminder) =>
        reminder.id === id
          ? {
              ...reminder,
              completed: toggledCompleted,
              triggered: toggledCompleted ? false : reminder.triggered,
              snoozedUntil: toggledCompleted ? null : reminder.snoozedUntil,
            }
          : reminder
      )
    );

    if (toggledCompleted && alertReminder?.id === id) {
      stopSound(true);
      setAlertReminder(null);
    }
  };

  const createShareLink = (reminder) => {
    const payload = encodeReminderData(reminder);
    return `${window.location.origin}${window.location.pathname}?share=${payload}`;
  };

  const copyShareLink = async (reminder) => {
    const link = createShareLink(reminder);
    try {
      await navigator.clipboard.writeText(link);
      setShareNote("Share link copied to clipboard.");
      setImportError("");
    } catch {
      setImportError("Clipboard copy failed. Try copying manually.");
    }
  };

  const importReminder = () => {
    const raw = importValue.trim();
    if (!raw) return;

    let payload = raw;
    if (raw.includes("?share=")) {
      payload = raw.split("?share=")[1];
    }

    const decoded = decodeReminderData(payload);
    let parsed = decoded;

    if (!parsed) {
      try {
        parsed = JSON.parse(raw);
      } catch {
        parsed = null;
      }
    }

    if (!parsed || !parsed.task) {
      setImportError("Paste a valid reminder share link or reminder JSON.");
      setShareNote("");
      return;
    }

    setReminders((current) => [
      ...current,
      {
        ...parsed,
        id: Date.now(),
        task: parsed.task.trim(),
        dueTime: parsed.dueTime || null,
        locationName: parsed.locationName || null,
        coords: parsed.coords || null,
        distanceThreshold: parsed.distanceThreshold || 300,
        triggered: false,
        snoozedUntil: null,
        completed: false,
      },
    ]);

    setImportError("");
    setShareNote("Reminder imported successfully.");
    setImportValue("");
  };

  const stopSound = (finishCurrent = false) => {
    if (soundLoopRef.current) {
      clearInterval(soundLoopRef.current);
      soundLoopRef.current = null;
    }

    if (!audioContextRef.current) return;

    if (finishCurrent) {
      const ctx = audioContextRef.current;
      audioContextRef.current = null;
      setTimeout(() => ctx.close().catch(() => {}), 1300);
      return;
    }

    audioContextRef.current.close().catch(() => {});
    audioContextRef.current = null;
  };

  const snoozeAlert = () => {
    if (!alertReminder) return;

    stopSound();
    hasCheckedOnMount.current = false;

    const snoozeMs = 10 * 60 * 1000;
    const snoozeUntil = Date.now() + snoozeMs;

    setReminders((current) =>
      current.map((reminder) =>
        reminder.id === alertReminder.id
          ? {
              ...reminder,
              snoozedUntil: snoozeUntil,
              triggered: false,
              dueTime:
                reminder.dueTime || new Date(Date.now() + snoozeMs).toISOString(),
            }
          : reminder
      )
    );

    setShareNote("Reminder snoozed for 10 minutes.");
    setAlertReminder(null);
  };

  const dismissAlert = () => {
    stopSound();
    hasCheckedOnMount.current = false;
    setAlertReminder(null);
  };

  return (
    <div className="container">
      <h1>{APP_CONFIG.name} 🔔</h1>
      <p className="app-description">
        A reminder system designed to help you complete tasks when and where they matter most.
      </p>

      <div className="task-mode">
        <span className="active">Time-Based</span>
      </div>

      <button className="future-feature-button" disabled title="Coming soon">
        Location Reminder
      </button>

      <div className="input-group">
        <input
          type="text"
          placeholder="What do you need to remember?"
          value={task}
          onChange={(e) => setTask(e.target.value)}
        />
        <button onClick={addReminder}>Save</button>
      </div>

      <div className="field-grid">
        {APP_CONFIG.timeRemindersEnabled && (
          <label>
            Reminder time (optional)
            <input
              type="datetime-local"
              value={time}
              onChange={(e) => setTime(e.target.value)}
            />
          </label>
        )}
      </div>

      {APP_CONFIG.shareEnabled && (
        <div className="share-panel">
          <label htmlFor="share-import">Import shared reminder</label>
          <div className="share-row">
            <input
              id="share-import"
              type="text"
              value={importValue}
              placeholder="Paste share link or reminder JSON"
              onChange={(e) => setImportValue(e.target.value)}
            />
            <button type="button" onClick={importReminder}>
              Import
            </button>
          </div>
          {shareNote && <p className="note">{shareNote}</p>}
          {importError && <p className="note error">{importError}</p>}
        </div>
      )}

      <div className="list-container">
        <h2>Saved reminders</h2>
        {reminders.length === 0 ? (
          <p className="empty-state">
            No tasks yet. Start by adding something you want to be reminded of—future versions will help remind you based on time or location.
          </p>
        ) : (
          <ul>
            {reminders.map((reminder) => {
              return (
                <li
                  key={reminder.id}
                  className={reminder.completed ? "done" : reminder.triggered ? "alert-item" : ""}
                  onClick={() => toggleComplete(reminder.id)}
                >
                  <div className="reminder-row">
                    <div>
                      <div className="reminder-text">{reminder.task}</div>
                      <div className="reminder-details">
                        {reminder.dueTime && <span>Due {formatTime(reminder.dueTime)}</span>}
                      </div>
                    </div>
                    {APP_CONFIG.shareEnabled && (
                      <button
                        className="share-button"
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          copyShareLink(reminder);
                        }}
                      >
                        Share
                      </button>
                    )}
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </div>

      <div className="roadmap">
        <h3>Coming Soon</h3>

        <div className="feature">
          <span className="feature-icon">📍</span>
          <div>
            <strong>Location-Based Reminders</strong>
            <span>Trigger tasks based on where you are</span>
          </div>
        </div>

        <div className="feature">
          <span className="feature-icon">⏰</span>
          <div>
            <strong>Smart Time Notifications</strong>
            <span>Flexible reminders that adapt to your schedule</span>
          </div>
        </div>

        <div className="feature">
          <span className="feature-icon">🧠</span>
          <div>
            <strong>ADHD-Friendly Reminder Modes</strong>
            <span>Designed to reduce ignored notifications</span>
          </div>
        </div>
      </div>

      {alertReminder && (
        <div className="alert-modal">
          <div className="modal-card">
            <div className="modal-header">
              <h2>🔔 SetPing Alert</h2>
            </div>
            <p className="modal-message">
              {alertReminder.triggerReason === "location"
                ? alertReminder.locationName
                  ? `You're close to ${alertReminder.locationName}. Oh, are you going to ${alertReminder.task.toLowerCase()}?`
                  : `You're near the reminder location. Oh, are you going to ${alertReminder.task.toLowerCase()}?`
                : alertReminder.triggerReason === "persistent"
                ? `Reminder: ${alertReminder.task}`
                : `It's time for: ${alertReminder.task}`}
            </p>
            {alertReminder.locationName && alertReminder.triggerReason === "time" && (
              <p className="modal-detail">Nearby target: {alertReminder.locationName}</p>
            )}
            {alertReminder.distance != null && (
              <p className="modal-detail">Within {alertReminder.distance} meters.</p>
            )}
            <div className="modal-actions">
              <button className="secondary-button" onClick={snoozeAlert}>
                ⏱️ Snooze 10 min
              </button>
              <button onClick={dismissAlert}>✓ Got it</button>
              {APP_CONFIG.soundEnabled && (
                <button className="stop-sound-button" onClick={stopSound}>
                  🔇 Mute
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
