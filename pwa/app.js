let deferredPrompt;
window.addEventListener('beforeinstallprompt', (e) => {
  e.preventDefault();
  deferredPrompt = e;
  document.getElementById('installBtn').onclick = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      deferredPrompt = null;
    }
  };
});

const storeKey = 'habit-tracker-data';
const load = () => JSON.parse(localStorage.getItem(storeKey) || '{"habits":[],"logs":{}}');
const save = (data) => localStorage.setItem(storeKey, JSON.stringify(data));
let state = load();

const addHabit = () => {
  const name = document.getElementById('habitName').value.trim();
  if (!name) return;
  const habit = {
    id: crypto.randomUUID(),
    name,
    category: document.getElementById('habitCategory').value,
    difficulty: document.getElementById('habitDifficulty').value,
    reminder: document.getElementById('habitReminder').value || null,
    notes: document.getElementById('habitNotes').value || '',
    createdAt: new Date().toISOString(),
  };
  state.habits.push(habit);
  save(state);
  render();
};
document.getElementById('addHabitBtn').onclick = addHabit;

const todayKey = () => new Date().toISOString().slice(0,10);
const toggleDone = (habitId) => {
  const dateKey = todayKey();
  state.logs[dateKey] ??= {};
  state.logs[dateKey][habitId] = !(state.logs[dateKey][habitId] || false);
  save(state);
  render();
};

const exportJson = () => {
  const blob = new Blob([JSON.stringify(state, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `habit-tracker-backup-${todayKey()}.json`;
  a.click();
  URL.revokeObjectURL(url);
};
document.getElementById('exportJsonBtn').onclick = exportJson;

document.getElementById('importJsonInput').addEventListener('change', async (e) => {
  const file = e.target.files[0];
  if (!file) return;
  const text = await file.text();
  state = JSON.parse(text);
  save(state);
  render();
});

const exportIcs = () => {
  const lines = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//Habit Tracker//PWA//EN',
  ];
  const date = todayKey().replace(/-/g,'');
  for (const h of state.habits) {
    if (!h.reminder) continue;
    lines.push('BEGIN:VEVENT');
    lines.push(`UID:${h.id}`);
    lines.push(`DTSTAMP:${date}T000000Z`);
    lines.push(`SUMMARY:${h.name}`);
    lines.push(`DESCRIPTION:Habit reminder`);
    lines.push(`RRULE:FREQ=DAILY`);
    lines.push('END:VEVENT');
  }
  lines.push('END:VCALENDAR');
  const blob = new Blob([lines.join('\r\n')], { type: 'text/calendar' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'habit-reminders.ics';
  a.click();
  URL.revokeObjectURL(url);
};
document.getElementById('exportIcsBtn').onclick = exportIcs;

const render = () => {
  const ul = document.getElementById('habitItems');
  ul.innerHTML = '';
  const dateKey = todayKey();
  for (const h of state.habits) {
    const li = document.createElement('li');
    const done = state.logs[dateKey]?.[h.id] || false;
    li.innerHTML = `
      <div>
        <div class="${done ? 'done' : ''}">${h.name}</div>
        <div class="habit-meta">${h.category} • ${h.difficulty} ${h.reminder ? '• ' + h.reminder : ''}</div>
      </div>
      <button>${done ? 'Undo' : 'Done'}</button>
    `;
    li.querySelector('button').onclick = () => toggleDone(h.id);
    ul.appendChild(li);
  }
  updateChart();
  updateStreaks();
};

const updateChart = () => {
  const ctx = document.getElementById('progressChart');
  const dateKey = todayKey();
  const total = state.habits.length;
  const done = Object.values(state.logs[dateKey] || {}).filter(Boolean).length;
  const data = {
    labels: ['Done', 'Remaining'],
    datasets: [{ data: [done, Math.max(0, total - done)], backgroundColor: ['#4F5BD5','#7EC8E3'] }],
  };
  if (!window._chart) {
    window._chart = new Chart(ctx, { type: 'doughnut', data, options: { plugins: { legend: { display: false } } } });
  } else {
    window._chart.data = data;
    window._chart.update();
  }
};

const updateStreaks = () => {
  let streak = 0;
  let longest = 0;
  const habitIds = state.habits.map(h => h.id);
  const daysBack = 60;
  for (let i=0; i<daysBack; i++) {
    const d = new Date(); d.setDate(d.getDate()-i);
    const key = d.toISOString().slice(0,10);
    const allDone = habitIds.every(id => (state.logs[key]?.[id]) || false);
    if (allDone) {
      streak++;
      longest = Math.max(longest, streak);
    } else {
      streak = 0;
    }
  }
  document.getElementById('streakInfo').textContent = `Current streak: ${streak} • Longest: ${longest}`;
};

if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('sw.js');
}

render();

