import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import "./Notes.css";

function Notes() {
  const [notes, setNotes] = useState([]);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("General");
  const [editingId, setEditingId] = useState(null);
  const [activeFormats, setActiveFormats] = useState([]);
  const editorRef = useRef(null);

  // Load saved notes
  useEffect(() => {
    const saved = localStorage.getItem("notes");
    if (saved) setNotes(JSON.parse(saved));
  }, []);

  // Save notes on update
  useEffect(() => {
    localStorage.setItem("notes", JSON.stringify(notes));
  }, [notes]);

  // Toggle format state + run command
  const toggleFormat = (command) => {
    document.execCommand(command, false, null);
    editorRef.current.focus();

    setActiveFormats((prev) =>
      prev.includes(command)
        ? prev.filter((f) => f !== command)
        : [...prev, command]
    );
  };

  // Add or update note
  const addNote = () => {
    const content = editorRef.current.innerHTML.trim();
    if (!content) return;

    if (editingId) {
      setNotes(
        notes.map((n) =>
          n.id === editingId ? { ...n, text: content, category } : n
        )
      );
      setEditingId(null);
    } else {
      setNotes([
        ...notes,
        { id: Date.now(), text: content, category: category || "General" },
      ]);
    }
    editorRef.current.innerHTML = "";
    setActiveFormats([]);
  };

  // Delete note
  const deleteNote = (id) => {
    setNotes(notes.filter((n) => n.id !== id));
  };

  // Edit note
  const editNote = (note) => {
    editorRef.current.innerHTML = note.text;
    setCategory(note.category);
    setEditingId(note.id);
  };

  // Export notes
  const exportNotes = () => {
    const blob = new Blob([JSON.stringify(notes, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "notes.json";
    link.click();
  };

  // Import notes
  const importNotes = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const imported = JSON.parse(event.target.result);
        setNotes(imported);
      } catch {
        alert("Invalid file format!");
      }
    };
    reader.readAsText(file);
  };

  // Filter notes
  const filteredNotes = notes.filter(
    (n) =>
      n.text.toLowerCase().includes(search.toLowerCase()) ||
      n.category.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="app">
      <h1 className="title">My Notes</h1>

      {/* Top bar */}
      <div className="top-bar">
        <input
          className="search"
          placeholder="Search notes..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <div className="buttons">
          <button onClick={exportNotes}>Export</button>
          <label className="import-btn">
            Import
            <input
              type="file"
              className="hidden"
              accept=".json"
              onChange={importNotes}
            />
          </label>
        </div>
      </div>

      {/* Toolbar + Category row */}
      <div className="note-toolbar">
        <div className="style-buttons">
          <button
            className={activeFormats.includes("bold") ? "active" : ""}
            onClick={() => toggleFormat("bold")}
          >
            B
          </button>
          <button
            className={activeFormats.includes("italic") ? "active" : ""}
            onClick={() => toggleFormat("italic")}
          >
            I
          </button>
          <button
            className={activeFormats.includes("underline") ? "active" : ""}
            onClick={() => toggleFormat("underline")}
          >
            U
          </button>
          <button onClick={() => toggleFormat("insertUnorderedList")}>
            • List
          </button>
          <button onClick={() => toggleFormat("insertOrderedList")}>
            1. List
          </button>
        </div>

        <select
          className="category-select small"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
        >
          <option>General</option>
          <option>Work</option>
          <option>Personal</option>
          <option>Ideas</option>
        </select>
      </div>

      {/* Notepad editor + add button */}
      <div className="note-form">
        <div
          ref={editorRef}
          className="note-input note-editor"
          contentEditable
          placeholder="Write your note..."
        ></div>
        <button onClick={addNote}>{editingId ? "Update" : "Add"}</button>
      </div>

      {/* Notes list */}
      <div className="notes-list">
        <AnimatePresence>
          {filteredNotes.map((note) => (
            <motion.div
              key={note.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, x: -50 }}
              className="note-card"
            >
              <div
                className="note-text"
                dangerouslySetInnerHTML={{ __html: note.text }}
              />
              <div className="note-actions">
                <button className="edit-btn" onClick={() => editNote(note)}>
                  Edit
                </button>
                <button
                  className="delete-btn"
                  onClick={() => deleteNote(note.id)}
                >
                  ✕
                </button>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}

export default Notes;
