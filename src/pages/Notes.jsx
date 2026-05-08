import { useState, useEffect, useMemo, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { marked } from "marked";
import "./Notes.css";

const THEMES = {
  "Warm Minimalism": {
    "--bg": "#111214",
    "--surface": "rgba(255, 244, 229, 0.12)",
    "--panel": "rgba(30, 25, 22, 0.84)",
    "--text": "#f8f5ee",
    "--muted": "#b9a89b",
    "--accent": "#f8c471",
    "--accent-soft": "rgba(248, 196, 113, 0.18)",
    "--shadow": "rgba(0, 0, 0, 0.35)",
    "--border": "rgba(255, 255, 255, 0.08)",
  },
  "Liquid Glass": {
    "--bg": "#0e1720",
    "--surface": "rgba(16, 29, 44, 0.78)",
    "--panel": "rgba(20, 38, 61, 0.82)",
    "--text": "#edf5ff",
    "--muted": "#99adcf",
    "--accent": "#70d6ff",
    "--accent-soft": "rgba(112, 214, 255, 0.18)",
    "--shadow": "rgba(0, 0, 0, 0.32)",
    "--border": "rgba(255, 255, 255, 0.08)",
  },
  "Notes App Chic": {
    "--bg": "#131519",
    "--surface": "rgba(26, 30, 36, 0.95)",
    "--panel": "rgba(38, 43, 53, 0.88)",
    "--text": "#f3f4f6",
    "--muted": "#9ca3af",
    "--accent": "#f97316",
    "--accent-soft": "rgba(249, 115, 22, 0.16)",
    "--shadow": "rgba(0, 0, 0, 0.45)",
    "--border": "rgba(255, 255, 255, 0.07)",
  },
};

const CATEGORY_SUGGESTIONS = ["General", "Work", "Personal", "Ideas", "Research", "Design"];

function Notes() {
  const [notes, setNotes] = useState([]);
  const [search, setSearch] = useState("");
  const [view, setView] = useState("list");
  const [editingId, setEditingId] = useState(null);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [category, setCategory] = useState("General");
  const [tags, setTags] = useState([]);
  const [tagInput, setTagInput] = useState("");
  const [themeName, setThemeName] = useState("Warm Minimalism");
  const [customTheme, setCustomTheme] = useState({
    "--bg": "#0f1520",
    "--surface": "rgba(21, 31, 46, 0.88)",
    "--panel": "rgba(28, 38, 53, 0.95)",
    "--text": "#eef2ff",
    "--muted": "#9fb1c7",
    "--accent": "#94f3ff",
    "--accent-soft": "rgba(148, 243, 255, 0.14)",
    "--shadow": "rgba(0, 0, 0, 0.34)",
    "--border": "rgba(255, 255, 255, 0.08)",
  });
  const [showPreview, setShowPreview] = useState(true);
  const [distractionFree, setDistractionFree] = useState(false);
  const [assistantReply, setAssistantReply] = useState("");
  const [savedSearches, setSavedSearches] = useState([]);
  const [activeGraphNode, setActiveGraphNode] = useState(null);

  const editorRef = useRef(null);

  useEffect(() => {
    const stored = localStorage.getItem("golden-notes-data");
    if (stored) {
      const parsed = JSON.parse(stored);
      setNotes(parsed.notes || []);
      setThemeName(parsed.themeName || "Warm Minimalism");
      setCustomTheme(parsed.customTheme || customTheme);
      setSavedSearches(parsed.savedSearches || []);
    }
  }, []);

  useEffect(() => {
    const savedState = {
      notes,
      themeName,
      customTheme,
      savedSearches,
    };
    localStorage.setItem("golden-notes-data", JSON.stringify(savedState));
  }, [notes, themeName, customTheme, savedSearches]);

  useEffect(() => {
    const theme = themeName === "Custom" ? customTheme : THEMES[themeName];
    const root = document.documentElement;
    Object.entries(theme).forEach(([key, value]) => {
      root.style.setProperty(key, value);
    });
  }, [themeName, customTheme]);

  useEffect(() => {
    const handler = (event) => {
      if ((event.ctrlKey || event.metaKey) && event.altKey && event.key.toLowerCase() === "n") {
        event.preventDefault();
        setTitle("");
        setContent("");
        setCategory("General");
        setTags([]);
        setEditingId(null);
        editorRef.current?.focus();
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  const normalizedSearch = search.trim().toLowerCase();

  const filteredNotes = useMemo(() => {
    const matchSearch = (text) => text.toLowerCase().includes(normalizedSearch);
    return notes
      .filter((note) => {
        if (!normalizedSearch) return true;
        return (
          matchSearch(note.title) ||
          matchSearch(note.content) ||
          note.category.toLowerCase().includes(normalizedSearch) ||
          note.tags.some((tag) => tag.toLowerCase().includes(normalizedSearch))
        );
      })
      .sort((a, b) => {
        const score = (note) => {
          let value = 0;
          value += note.pinned ? 300 : 0;
          value += note.favorite ? 120 : 0;
          value += note.updatedAt ? new Date(note.updatedAt).valueOf() / 100000 : 0;
          value += note.content.split(" ").length;
          return value;
        };
        return score(b) - score(a);
      });
  }, [notes, normalizedSearch]);

  const suggestedTags = useMemo(() => {
    if (!content) return [];
    const keywords = ["project", "meeting", "idea", "plan", "research", "study", "design", "copy", "review"];
    return keywords.filter((word) => content.toLowerCase().includes(word)).slice(0, 4);
  }, [content]);

  const allGraphNodes = useMemo(() => {
    return notes.map((note, index) => ({
      ...note,
      x: 120 + (index % 3) * 250,
      y: 90 + Math.floor(index / 3) * 140,
    }));
  }, [notes]);

  const graphEdges = useMemo(() => {
    const edges = [];
    notes.forEach((note) => {
      const links = Array.from(note.content.matchAll(/\[\[([^\]]+)\]\]/g)).map((m) => m[1]);
      links.forEach((title) => {
        const target = notes.find((n) => n.title.toLowerCase() === title.toLowerCase());
        if (target) edges.push({ source: note.id, target: target.id });
      });
    });
    return edges;
  }, [notes]);

  const activeNote = filteredNotes[0];

  const markdownHtml = (text) => {
    return { __html: marked.parse(text || "") };
  };

  const resetForm = () => {
    setTitle("");
    setContent("");
    setCategory("General");
    setTags([]);
    setTagInput("");
    setEditingId(null);
    setAssistantReply("");
  };

  const persistNotes = (updatedNotes) => {
    setNotes(updatedNotes);
  };

  const addOrUpdateNote = () => {
    if (!title.trim() && !content.trim()) return;

    const noteTitle = title.trim() || content.split("\n")[0].slice(0, 40) || "Untitled note";
    const now = new Date().toISOString();
    const noteData = {
      title: noteTitle,
      content: content.trim(),
      category: category || "General",
      tags: Array.from(new Set(tags.concat(suggestedTags))).slice(0, 8),
      favorite: false,
      pinned: false,
      updatedAt: now,
      createdAt: editingId ? notes.find((n) => n.id === editingId)?.createdAt : now,
    };

    if (editingId) {
      persistNotes(
        notes.map((note) =>
          note.id === editingId
            ? {
                ...note,
                ...noteData,
                history: [
                  ...(note.history || []),
                  { content: note.content, title: note.title, timestamp: note.updatedAt },
                ],
              }
            : note
        )
      );
    } else {
      persistNotes([{ ...noteData, id: Date.now(), history: [] }, ...notes]);
    }

    resetForm();
  };

  const deleteNote = (id) => {
    persistNotes(notes.filter((note) => note.id !== id));
  };

  const editNote = (note) => {
    setEditingId(note.id);
    setTitle(note.title);
    setContent(note.content);
    setCategory(note.category);
    setTags(note.tags || []);
    setShowPreview(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const toggleFavorite = (id) => {
    persistNotes(notes.map((note) => (note.id === id ? { ...note, favorite: !note.favorite } : note)));
  };

  const togglePin = (id) => {
    persistNotes(notes.map((note) => (note.id === id ? { ...note, pinned: !note.pinned } : note)));
  };

  const addTag = () => {
    const next = tagInput.trim().replace(/^#/, "");
    if (next && !tags.includes(next)) {
      setTags([...tags, next]);
    }
    setTagInput("");
  };

  const removeTag = (tag) => {
    setTags(tags.filter((item) => item !== tag));
  };

  const insertBlock = (block) => {
    const blocks = {
      checklist: "- [ ] Task item\n",
      quote: "> Inspiring note or thought\n",
      code: "```js\nconsole.log('hello GoldenNotes');\n```\n",
      table: "| Column | Column |\n|---|---|\n| Value | Value |\n",
      embedImage: "![Preview image](https://via.placeholder.com/450x200)\n",
      divider: "---\n",
    };
    setContent((current) => `${current}${blocks[block] || ""}`);
    editorRef.current?.focus();
  };

  const runAssistant = (mode) => {
    const text = content || title;
    if (!text) {
      setAssistantReply("Start writing to get AI suggestions.");
      return;
    }

    if (mode === "summarize") {
      const summary = text
        .split(/[\.\n]/)
        .filter((line) => line.trim().length > 20)
        .slice(0, 2)
        .join(". ")
        .trim();
      setAssistantReply(summary || "This note is concise and already well organized.");
    }

    if (mode === "fix") {
      const fixed = text
        .replace(/\bi\b/g, "I")
        .replace(/\s+\./g, ".")
        .replace(/\s+,/g, ",")
        .replace(/\bteh\b/g, "the");
      setContent(fixed);
      setAssistantReply("Grammar and clarity suggestions applied in the editor.");
    }

    if (mode === "template") {
      setContent("# Project Objective\n\n- Key outcome:\n- Timeline:\n- Next actions:\n\n## Research\n\n## Notes\n\n## Links & References\n");
      setAssistantReply("Template inserted. Customize each section for your project.");
    }
  };

  const saveSearchView = () => {
    if (!normalizedSearch) return;
    const next = normalizedSearch;
    if (!savedSearches.includes(next)) {
      setSavedSearches([next, ...savedSearches].slice(0, 6));
    }
  };

  const applySavedSearch = (query) => {
    setSearch(query);
  };

  const exportMarkdown = () => {
    const markdown = notes
      .map((note) => `# ${note.title}\n\n${note.content}\n\n---`)
      .join("\n\n");
    const blob = new Blob([markdown], { type: "text/markdown" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "golden-notes.md";
    link.click();
  };

  const copyShareLink = (note) => {
    const url = `${window.location.origin}/notes?share=${note.id}`;
    navigator.clipboard.writeText(url);
  };

  const builtInFilters = ["Pinned", "Favorites", "Recent", "Markdown"];

  const noteCount = notes.length;
  const activeNotes = filteredNotes;

  return (
    <div className={`notes-page ${distractionFree ? "distraction-free" : ""}`}>
      <div className="notes-header">
        <div>
          <h1 className="notes-title">GoldenNotes Studio</h1>
          <p className="notes-subtitle">
            Think with structure, embed media, build knowledge links, and keep every idea actionable.
          </p>
        </div>
        <div className="theme-selector">
          <label>Theme</label>
          <select value={themeName} onChange={(e) => setThemeName(e.target.value)}>
            {Object.keys(THEMES).map((key) => (
              <option key={key} value={key}>{key}</option>
            ))}
            <option value="Custom">Custom</option>
          </select>
        </div>
      </div>

      <div className="notes-toolbar">
        <div className="toolbar-group">
          <input
            className="search"
            placeholder="Search by title, tag, link..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <div className="pill-row">
            {savedSearches.map((saved) => (
              <button key={saved} className="pill" onClick={() => applySavedSearch(saved)}>
                {saved}
              </button>
            ))}
          </div>
        </div>

        <div className="toolbar-actions">
          <button className="ghost" onClick={() => setView("list")}>Notes</button>
          <button className="ghost" onClick={() => setView("graph")}>Graph</button>
          <button className="ghost" onClick={() => setView("split")}>Split Preview</button>
          <button className="ghost" onClick={() => setDistractionFree((prev) => !prev)}>
            {distractionFree ? "Exit Focus" : "Focus Mode"}
          </button>
          <button onClick={saveSearchView}>Save View</button>
          <button onClick={exportMarkdown}>Export MD</button>
        </div>
      </div>

      <div className="editor-panel">
        <div className="editor-card">
          <div className="editor-header">
            <div>
              <span className="micro-label">Editor</span>
              <h2>{editingId ? "Update note" : "New note"}</h2>
            </div>
            <div className="editor-meta">
              <span>{noteCount} notes</span>
              <span>Quick</span>
            </div>
          </div>

          <div className="form-grid">
            <div className="field-group">
              <label>Title</label>
              <input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Write a headline or project name"
              />
            </div>
            <div className="field-group">
              <label>Category</label>
              <select value={category} onChange={(e) => setCategory(e.target.value)}>
                {CATEGORY_SUGGESTIONS.map((item) => (
                  <option key={item}>{item}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="form-grid">
            <div className="field-group wide">
              <label>Content</label>
              <textarea
                ref={editorRef}
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Write Markdown, embed [[notes]], add blocks with / commands..."
              />
            </div>
            <div className="field-group narrow">
              <label>Tags</label>
              <div className="tag-input-row">
                <input
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && addTag()}
                  placeholder="Add tag" 
                />
                <button className="small" onClick={addTag}>Add</button>
              </div>
              <div className="tag-list">
                {tags.concat(suggestedTags).map((tag) => (
                  <button key={tag} className="tag-pill" onClick={() => removeTag(tag)}>
                    #{tag}
                  </button>
                ))}
              </div>

              <div className="inline-actions">
                <button className="ghost" onClick={() => insertBlock("checklist")}>/Checklist</button>
                <button className="ghost" onClick={() => insertBlock("quote")}>/Quote</button>
                <button className="ghost" onClick={() => insertBlock("code")}>/Code</button>
                <button className="ghost" onClick={() => insertBlock("table")}>/Table</button>
              </div>
            </div>
          </div>

          <div className="editor-footer">
            <button className="secondary" onClick={() => runAssistant("summarize")}>
              Summarize
            </button>
            <button className="secondary" onClick={() => runAssistant("fix")}>
              Fix grammar
            </button>
            <button className="secondary" onClick={() => runAssistant("template")}>
              Insert template
            </button>
            <button onClick={addOrUpdateNote}>{editingId ? "Save update" : "Create note"}</button>
          </div>

          {assistantReply && <div className="assistant-panel">{assistantReply}</div>}
        </div>

        {view !== "graph" && (
          <div className={`preview-card ${showPreview ? "active" : ""}`}>
            <div className="preview-header">
              <div>
                <span className="micro-label">Preview</span>
                <h2>Live Markdown</h2>
              </div>
              <div className="preview-actions">
                <button className="ghost" onClick={() => setShowPreview((prev) => !prev)}>
                  {showPreview ? "Hide" : "Show"}
                </button>
              </div>
            </div>
            {showPreview && (
              <div className="preview-body" dangerouslySetInnerHTML={markdownHtml(content)} />
            )}
          </div>
        )}
      </div>

      {view === "graph" && (
        <div className="graph-panel">
          <div className="graph-header">
            <div>
              <span className="micro-label">Knowledge Map</span>
              <h2>Connected notes</h2>
            </div>
            <p>Hover nodes to reveal links. Create bi-directional connections with [[Note Title]]. {allGraphNodes.length > 0 ? `${allGraphNodes.length} note${allGraphNodes.length !== 1 ? 's' : ''} • ${graphEdges.length} link${graphEdges.length !== 1 ? 's' : ''}` : 'Add notes to build your knowledge graph.'}</p>
          </div>
          <div className="graph-canvas">
            {allGraphNodes.length === 0 ? (
              <div className="graph-empty">
                <p>📊 Your knowledge graph is empty</p>
                <p>Start adding notes to visualize connections!</p>
              </div>
            ) : (
              <svg preserveAspectRatio="xMidYMid meet" className="graph-svg">
                <defs>
                  <marker id="arrowhead" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">
                    <polygon points="0 0, 10 3.5, 0 7" fill="var(--accent)" />
                  </marker>
                </defs>
                {graphEdges.map((edge, index) => {
                  const source = allGraphNodes.find((node) => node.id === edge.source);
                  const target = allGraphNodes.find((node) => node.id === edge.target);
                  if (!source || !target) return null;
                  return (
                    <line
                      key={`edge-${index}`}
                      x1={source.x}
                      y1={source.y}
                      x2={target.x}
                      y2={target.y}
                      className="graph-edge"
                      markerEnd="url(#arrowhead)"
                    />
                  );
                })}
                {allGraphNodes.map((node) => (
                  <g
                    key={`node-${node.id}`}
                    className="graph-node"
                    transform={`translate(${node.x}, ${node.y})`}
                    onMouseEnter={() => setActiveGraphNode(node.id)}
                    onMouseLeave={() => setActiveGraphNode(null)}
                    onClick={() => editNote(node)}
                  >
                    <circle r="40" className={activeGraphNode === node.id ? "active" : ""} />
                    <text x="0" y="5" textAnchor="middle" alignmentBaseline="middle" className="graph-node-label">
                      {node.title.slice(0, 12)}
                    </text>
                  </g>
                ))}
              </svg>
            )}
          </div>
        </div>
      )}

      <div className="notes-feed">
        <div className="smart-strip">
          <div>
            <span className="micro-label">Smart pick</span>
            <h2>{activeNote ? activeNote.title : "No notes yet"}</h2>
          </div>
          {activeNote && (
            <div className="smart-meta">
              <span>{activeNote.category}</span>
              <span>{activeNote.tags.join(", ")}</span>
              <span>{new Date(activeNote.updatedAt).toLocaleDateString()}</span>
            </div>
          )}
        </div>

        <AnimatePresence>
          {activeNotes.map((note) => (
            <motion.div
              key={note.id}
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96 }}
              className={`note-card ${note.pinned ? "pinned" : ""}`}
            >
              <div className="note-header">
                <div>
                  <h3>{note.title}</h3>
                  <p className="note-meta">
                    {note.category} • {note.tags.join(" • ")} • {new Date(note.updatedAt).toLocaleDateString()}
                  </p>
                </div>
                <div className="note-flags">
                  <button className={`icon ${note.favorite ? "active" : ""}`} onClick={() => toggleFavorite(note.id)}>
                    ★
                  </button>
                  <button className={`icon ${note.pinned ? "active" : ""}`} onClick={() => togglePin(note.id)}>
                    📌
                  </button>
                </div>
              </div>
              <div className="note-preview" dangerouslySetInnerHTML={markdownHtml(note.content)} />

              <div className="note-actions-row">
                <button className="ghost" onClick={() => editNote(note)}>Edit</button>
                <button className="ghost" onClick={() => copyShareLink(note)}>Share</button>
                <button className="ghost small" onClick={() => deleteNote(note.id)}>Delete</button>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}

export default Notes;
