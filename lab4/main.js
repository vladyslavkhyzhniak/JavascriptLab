document.getElementById('saveNote').addEventListener('click', saveNote);
renderNotes();

function getNotes() {
    const notes = localStorage.getItem('notes');
    return notes ? JSON.parse(notes) : [];
}

function renderNotes() {
    const notes = getNotes();

    notes.sort((a, b) => {
        if (a.pinned === false && b.pinned === true) {
            return 1;
        }
        if (a.pinned === true && b.pinned === false) {
            return -1;
        }
        return 0;
    });

    const notesList = document.getElementById('notesList');
    notesList.innerHTML = '';

    notes.forEach((note, index) => {
        const noteElement = createNoteElement(note, index);
        notesList.appendChild(noteElement);
    });
}

function saveNotes(notes) {
    localStorage.setItem('notes', JSON.stringify(notes));
}

function saveNote() {
    const title = document.getElementById('title').value;
    const content = document.getElementById('content').value;
    const color = document.getElementById('color').value;
    const pinned = document.getElementById('pin').checked;

    if (!title || !content) {
        alert('Tytuł i treść notatki są wymagane!');
        return;
    }

    const notes = getNotes();
    const newNote = {
        title,
        content,
        color,
        pinned,
        createdAt: new Date().toISOString()
    };

    notes.push(newNote);
    saveNotes(notes);
    renderNotes();

    document.getElementById('title').value = '';
    document.getElementById('content').value = '';
    document.getElementById('color').value = '#ffffff';
    document.getElementById('pin').checked = false;
}

function deleteNote(index) {
    const notes = getNotes();
    notes.splice(index, 1);
    saveNotes(notes);
    renderNotes();
}

function createNoteElement(note, index) {
    const noteElement = document.createElement('div');
    noteElement.classList.add('note');
    noteElement.style.backgroundColor = note.color;

    const titleElement = document.createElement('div');
    titleElement.classList.add('title');
    titleElement.textContent = note.title;

    const contentElement = document.createElement('div');
    contentElement.classList.add('content');
    contentElement.textContent = note.content;

    const dateElement = document.createElement('div');
    dateElement.classList.add('date');
    dateElement.textContent = `Utworzono: ${new Date(note.createdAt).toLocaleString()}`;

    const deleteButton = document.createElement('button');
    deleteButton.textContent = 'Usuń';
    deleteButton.addEventListener('click', () => deleteNote(index));

    noteElement.appendChild(titleElement);
    noteElement.appendChild(contentElement);
    noteElement.appendChild(dateElement);
    noteElement.appendChild(deleteButton);

    if (note.pinned) {
        noteElement.classList.add('pinned');
    }
    return noteElement;
}

