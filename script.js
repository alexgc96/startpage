const timeSpan = document.querySelector('.time')
const ampmSpan = document.querySelector('.ampm')
const weatherDiv = document.querySelector('.weather')
const day = document.querySelector('.date')
const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
const weatherDescriptions = {
     0: '☀️ Clear',
    1: '🌤️ Mostly Clear',
    2: '⛅ Partly Cloudy',
    3: '☁️ Overcast',
    45: '🌫️ Foggy',
    61: '🌧️ Light Rain',
    63: '🌧️ Rain',
    80: '🌦️ Showers',
    95: '⛈️ Thunderstorm'
}

function updateClock(){
    const now = new Date()
    const minutes = String(now.getMinutes()).padStart(2, '0')
    const hours24 = now.getHours()
    const hours12 = hours24 % 12 || 12
    const ampm = hours24 >= 12 ? 'PM' : 'AM'
    const hours = String(hours12).padStart(2, '0')
    const dayIndex = now.getDay()
    const monthIndex = now.getMonth()
    const dayNumber = now.getDate()

    timeSpan.textContent = hours + ':' + minutes
    ampmSpan.textContent = ampm
    day.textContent = dayNames[dayIndex] + ' ' + dayNumber + ' ' + monthNames[monthIndex]
}
updateClock()
setInterval(updateClock, 1000)

async function fetchweather() {
    const response = await fetch('https://api.open-meteo.com/v1/forecast?latitude=32.6249&longitude=-115.4436&current_weather=true&temperature_unit=fahrenheit')
    const data = await response.json()
    const weatherSymbol = data.current_weather.weathercode
    const weatherTemp = data.current_weather.temperature
    weatherDiv.textContent = weatherDescriptions[weatherSymbol] + "  " + Math.round(weatherTemp) + '°F'
}
fetchweather()
setInterval(fetchweather, 90000)

// ─── Search ───────────────────────────────────────────────────────────────────

const searchOverlay = document.getElementById('searchOverlay')
const searchInput = document.getElementById('searchInput')

function openSearch(firstChar) {
    searchOverlay.classList.add('active')
    searchInput.value = firstChar || ''
    searchInput.focus()
    if (firstChar) {
        // place caret at end
        const len = searchInput.value.length
        searchInput.setSelectionRange(len, len)
    }
}

function closeSearch() {
    searchOverlay.classList.remove('active')
    searchInput.value = ''
}

function submitSearch() {
    const q = searchInput.value.trim()
    if (q) window.open('https://www.google.com/search?q=' + encodeURIComponent(q), '_blank')
    closeSearch()
}

// ─── Notes panel ──────────────────────────────────────────────────────────────

const notesPanel = document.getElementById('notesPanel')
const noteInput = document.getElementById('noteInput')
const notesList = document.getElementById('notesList')
const saveNoteBtn = document.getElementById('saveNote')

function loadNotes() {
    return JSON.parse(localStorage.getItem('startpage_notes') || '[]')
}

function saveNotes(notes) {
    localStorage.setItem('startpage_notes', JSON.stringify(notes))
}

function formatNoteDate(isoString) {
    const d = new Date(isoString)
    const dn = dayNames[d.getDay()]
    const mn = monthNames[d.getMonth()]
    const date = d.getDate()
    const yr = d.getFullYear()
    const hh = String(d.getHours()).padStart(2, '0')
    const mm = String(d.getMinutes()).padStart(2, '0')
    return `// ${dn} ${mn} ${date} ${yr} · ${hh}:${mm}`
}

function renderNotes() {
    const notes = loadNotes()
    notesList.innerHTML = ''
    notes.forEach(n => {
        const item = document.createElement('div')
        item.className = 'note-item'

        const dateEl = document.createElement('div')
        dateEl.className = 'note-date'
        dateEl.textContent = formatNoteDate(n.date)

        const contentEl = document.createElement('div')
        contentEl.className = 'note-content'
        contentEl.textContent = n.content

        const delBtn = document.createElement('button')
        delBtn.className = 'note-delete'
        delBtn.textContent = '[x]'
        delBtn.addEventListener('click', () => deleteNote(n.id))

        item.appendChild(dateEl)
        item.appendChild(contentEl)
        item.appendChild(delBtn)
        notesList.appendChild(item)
    })
}

function addNote() {
    const content = noteInput.value.trim()
    if (!content) return
    const notes = loadNotes()
    notes.unshift({ id: Date.now(), content, date: new Date().toISOString() })
    saveNotes(notes)
    noteInput.value = ''
    renderNotes()
}

function deleteNote(id) {
    const notes = loadNotes().filter(n => n.id !== id)
    saveNotes(notes)
    renderNotes()
}

saveNoteBtn.addEventListener('click', addNote)
noteInput.addEventListener('keydown', e => {
    if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) addNote()
})

renderNotes()

// ─── Tasks panel ──────────────────────────────────────────────────────────────

const tasksPanel = document.getElementById('tasksPanel')
const taskInput = document.getElementById('taskInput')
const taskDue = document.getElementById('taskDue')
const tasksList = document.getElementById('tasksList')
const addTaskBtn = document.getElementById('addTask')

function loadTasks() {
    return JSON.parse(localStorage.getItem('startpage_tasks') || '[]')
}

function saveTasks(tasks) {
    localStorage.setItem('startpage_tasks', JSON.stringify(tasks))
}

function renderTasks() {
    const tasks = loadTasks()
    // undone first, done last
    tasks.sort((a, b) => a.done - b.done)
    tasksList.innerHTML = ''
    tasks.forEach(t => {
        const item = document.createElement('div')
        item.className = 'task-item' + (t.done ? ' done' : '')

        const cb = document.createElement('input')
        cb.type = 'checkbox'
        cb.checked = t.done
        cb.addEventListener('change', () => toggleTask(t.id))

        const textWrap = document.createElement('div')
        textWrap.style.flex = '1'

        const textEl = document.createElement('div')
        textEl.className = 'task-text'
        textEl.textContent = t.content

        textWrap.appendChild(textEl)

        if (t.dueDate) {
            const dueEl = document.createElement('span')
            dueEl.className = 'task-due'
            dueEl.textContent = '// due ' + t.dueDate
            textWrap.appendChild(dueEl)
        }

        const delBtn = document.createElement('button')
        delBtn.className = 'task-delete'
        delBtn.textContent = '[x]'
        delBtn.addEventListener('click', () => deleteTask(t.id))

        item.appendChild(cb)
        item.appendChild(textWrap)
        item.appendChild(delBtn)
        tasksList.appendChild(item)
    })
}

function addTask() {
    const content = taskInput.value.trim()
    if (!content) return
    const tasks = loadTasks()
    tasks.push({ id: Date.now(), content, done: false, dueDate: taskDue.value || null })
    saveTasks(tasks)
    taskInput.value = ''
    taskDue.value = ''
    renderTasks()
}

function toggleTask(id) {
    const tasks = loadTasks().map(t => t.id === id ? { ...t, done: !t.done } : t)
    saveTasks(tasks)
    renderTasks()
}

function deleteTask(id) {
    const tasks = loadTasks().filter(t => t.id !== id)
    saveTasks(tasks)
    renderTasks()
}

addTaskBtn.addEventListener('click', addTask)
taskInput.addEventListener('keydown', e => { if (e.key === 'Enter') addTask() })

renderTasks()

// ─── Global keyboard routing ──────────────────────────────────────────────────
// [ → toggle notes   ] → toggle tasks   Esc → close all   any printable → search

document.addEventListener('keydown', e => {
    const searchActive = searchOverlay.classList.contains('active')
    const notesFocused = notesPanel.contains(document.activeElement)
    const tasksFocused = tasksPanel.contains(document.activeElement)

    if (e.key === 'Escape') {
        if (searchActive) { closeSearch(); return }
        notesPanel.classList.remove('open')
        tasksPanel.classList.remove('open')
        return
    }

    // Don't intercept when typing inside a panel
    if (notesFocused || tasksFocused) return

    if (e.key === '[' && !searchActive) {
        e.preventDefault()
        notesPanel.classList.toggle('open')
        return
    }

    if (e.key === ']' && !searchActive) {
        e.preventDefault()
        tasksPanel.classList.toggle('open')
        return
    }

    if (e.key === 'Enter' && searchActive) {
        submitSearch()
        return
    }

    // open search on any single printable char (not modifier combos)
    if (!searchActive && e.key.length === 1 && !e.ctrlKey && !e.metaKey && !e.altKey) {
        e.preventDefault()
        openSearch(e.key)
    }
})
