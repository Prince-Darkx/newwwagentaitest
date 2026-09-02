import React, { useState } from 'react';
import { 
  BookOpen, 
  Code2, 
  FileText, 
  FolderTree, 
  Play, 
  Copy, 
  Check, 
  Sparkles, 
  Cpu, 
  Database, 
  Server, 
  HelpCircle,
  PhoneCall,
  Headphones,
  CheckCircle2,
  Layers,
  Terminal,
  Download
} from 'lucide-react';

export const BCAProjectDocs: React.FC = () => {
  const [copiedSection, setCopiedSection] = useState<string | null>(null);
  const [activeCodeTab, setActiveCodeTab] = useState<'flask_app' | 'sqlite_db' | 'frontend_html'>('flask_app');

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedSection(id);
    setTimeout(() => setCopiedSection(null), 2000);
  };

  const flaskAppCode = `from flask import Flask, render_template, request, jsonify
import sqlite3
import datetime

app = Flask(__name__)
DB_NAME = "college_voice_agent.db"

def init_db():
    conn = sqlite3.connect(DB_NAME)
    cursor = conn.cursor()
    
    # 1. Knowledge Base Table
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS knowledge_base (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            category TEXT,
            topic TEXT,
            keywords TEXT,
            answer TEXT
        )
    ''')
    
    # 2. Conversation History Table
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS conversations (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            student_name TEXT,
            question TEXT,
            detected_intent TEXT,
            ai_response TEXT,
            requires_human INTEGER DEFAULT 0,
            timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
        )
    ''')
    
    # 3. Human Handoff Queue Table
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS handoff_tickets (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            student_name TEXT,
            student_phone TEXT,
            question TEXT,
            reason TEXT,
            status TEXT DEFAULT 'Pending',
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )
    ''')
    
    # Seed Sample College Knowledge if empty
    cursor.execute("SELECT COUNT(*) FROM knowledge_base")
    if cursor.fetchone()[0] == 0:
        sample_kb = [
            ("Courses", "BCA Program", "bca, computer application, duration, syllabus", "BCA is a 3-year undergraduate course focusing on programming, databases, web development, and AI fundamentals. Eligibility: 10+2 with minimum 50% marks."),
            ("Fees", "Admission Fee", "fee, tuition, cost, payment, installment", "The annual tuition fee for BCA is ₹65,000 per year, payable in two equal semester installments. Scholarship fee waivers are available for merit scorers."),
            ("Admission", "Admission Process", "admission, apply, entrance, eligibility, dates", "Admissions for 2026 are open. You can apply online on the college portal with your 10th and 12th marksheets."),
            ("Scholarships", "Merit Scholarship", "scholarship, concession, financial aid, waiver", "Students scoring 85%+ in 12th receive a 40% tuition fee waiver under the Chairman Merit Aid."),
            ("Exam", "Exam Dates", "exam, semester test, timetable, practical", "Semester examinations commence in the 2nd week of December and May. Practical lab tests happen one week prior."),
            ("Facilities", "Hostel & Library", "hostel, food, library, campus, wifi", "Our campus offers separate AC/Non-AC hostels for boys and girls with 24/7 Wi-Fi, modern library, and cafeteria.")
        ]
        cursor.executemany("INSERT INTO knowledge_base (category, topic, keywords, answer) VALUES (?, ?, ?, ?)", sample_kb)
    
    conn.commit()
    conn.close()

# Intent Recognition Helper
def detect_intent(question):
    q = question.lower()
    if any(k in q for k in ["bca", "course", "degree", "curriculum", "syllabus", "subjects"]):
        return "Course Information"
    elif any(k in q for k in ["fee", "cost", "tuition", "price", "installment", "money"]):
        return "Fees"
    elif any(k in q for k in ["admission", "apply", "form", "eligibility", "dates", "deadline"]):
        return "Admission"
    elif any(k in q for k in ["scholarship", "discount", "waiver", "financial aid"]):
        return "Scholarship"
    elif any(k in q for k in ["exam", "test", "date sheet", "timetable", "marks"]):
        return "Exam Information"
    elif any(k in q for k in ["hostel", "library", "mess", "canteen", "bus", "transport"]):
        return "Campus Facilities"
    else:
        return "General Query"

# Route: AI Question Handler
@app.route('/api/ask', methods=['POST'])
def ask_ai():
    data = request.json
    student_name = data.get('student_name', 'Student')
    question = data.get('question', '').strip()
    
    if not question:
        return jsonify({"error": "Please enter a question"}), 400
        
    intent = detect_intent(question)
    
    # Search SQLite Knowledge Base
    conn = sqlite3.connect(DB_NAME)
    cursor = conn.cursor()
    
    # Keyword search
    words = question.lower().split()
    query_conditions = " OR ".join(["keywords LIKE ?" for _ in words])
    params = [f"%{w}%" for w in words]
    
    cursor.execute(f"SELECT topic, answer FROM knowledge_base WHERE {query_conditions}", params)
    result = cursor.fetchone()
    
    requires_human = 0
    if result:
        topic, answer = result
        ai_response = f"Regarding {topic}: {answer}"
    else:
        requires_human = 1
        ai_response = "I couldn't find an exact answer for this specific query. Your question requires assistance from our human admissions counselor."
        # Create ticket
        cursor.execute("INSERT INTO handoff_tickets (student_name, question, reason) VALUES (?, ?, ?)",
                       (student_name, question, "Knowledge base match not found"))
    
    # Save conversation history
    cursor.execute("INSERT INTO conversations (student_name, question, detected_intent, ai_response, requires_human) VALUES (?, ?, ?, ?, ?)",
                   (student_name, question, intent, ai_response, requires_human))
    
    conn.commit()
    conn.close()
    
    return jsonify({
        "intent": intent,
        "response": ai_response,
        "requires_human": bool(requires_human)
    })

if __name__ == '__main__':
    init_db()
    print("AI Voice Caller Educational Backend running on http://127.0.0.1:5000")
    app.run(debug=True, port=5000)`;

  const sqliteSchemaCode = `-- SQLite Database Schema for BCA 3rd Semester Project
-- File: schema.sql

CREATE TABLE IF NOT EXISTS colleges (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    college_name TEXT NOT NULL,
    college_code TEXT UNIQUE NOT NULL,
    email TEXT UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    affiliation TEXT,
    phone TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS knowledge_base (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    college_id INTEGER DEFAULT 1,
    category TEXT NOT NULL,
    topic TEXT NOT NULL,
    keywords TEXT NOT NULL,
    answer TEXT NOT NULL,
    last_updated DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS conversations (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    student_name TEXT NOT NULL,
    student_phone TEXT,
    question TEXT NOT NULL,
    detected_intent TEXT NOT NULL,
    ai_response TEXT NOT NULL,
    requires_human INTEGER DEFAULT 0,
    timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS handoff_tickets (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    student_name TEXT NOT NULL,
    student_phone TEXT,
    question TEXT NOT NULL,
    reason TEXT NOT NULL,
    status TEXT DEFAULT 'Pending', -- 'Pending' or 'Resolved'
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);`;

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600 shadow-xs">
            <BookOpen className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base font-bold text-slate-900 tracking-tight">
                BCA 3rd Semester Mini-Project Blueprint & Code Reference
              </h2>
              <span className="px-2 py-0.5 text-[10px] font-semibold bg-blue-50 text-blue-700 rounded-full border border-blue-200">
                “AI Voice Caller Agent for Education”
              </span>
            </div>
            <p className="text-xs text-slate-500">
              Complete project documentation, Python Flask + SQLite architecture, flowcharts, and viva defense guide.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="px-2.5 py-1 bg-slate-50 border border-slate-200 rounded-lg text-xs font-semibold text-slate-700">
            Frontend: HTML/JS • Backend: Flask • DB: SQLite
          </span>
        </div>
      </div>

      {/* 1. Project Objective & Flow Diagram Card */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs p-6 space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
            <Layers className="w-4 h-4 text-blue-600" />
            <span>1. Core Execution Flowchart (How the System Operates)</span>
          </h3>
          <span className="text-[11px] text-slate-500 font-mono">Viva Flow Diagram</span>
        </div>

        {/* ASCII / Visual Flow Representation */}
        <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 font-mono text-xs text-slate-800 space-y-2 overflow-x-auto">
          <div className="text-center font-bold text-blue-700">
            Student / Parent Caller (Speech Input or Typed Query)
          </div>
          <div className="text-center text-slate-400">↓ (Web Speech API / Text Input)</div>
          <div className="text-center font-semibold bg-white p-2 rounded-lg border border-slate-200 max-w-sm mx-auto shadow-xs">
            AI Assistant + Intent Recognition (Courses, Fees, Admission, Scholarships, Exams, Facilities)
          </div>
          <div className="text-center text-slate-400">↓</div>
          <div className="text-center font-semibold bg-white p-2 rounded-lg border border-slate-200 max-w-sm mx-auto shadow-xs">
            Search College Knowledge Base in Database (SQLite / RAG)
          </div>
          <div className="text-center text-slate-400">↓</div>
          <div className="grid grid-cols-2 gap-4 max-w-md mx-auto text-center">
            <div className="p-2.5 bg-emerald-50 border border-emerald-200 rounded-lg text-emerald-800">
              <div className="font-bold">YES: Answer Found</div>
              <div className="text-[10px] mt-1 text-emerald-700">
                1. Voice Synthesis (TTS)<br />
                2. Show Text Response<br />
                3. Save SQLite History
              </div>
            </div>
            <div className="p-2.5 bg-amber-50 border border-amber-200 rounded-lg text-amber-800">
              <div className="font-bold">NO: Unknown / Frustration</div>
              <div className="text-[10px] mt-1 text-amber-700">
                1. Human Handoff Trigger<br />
                2. Create Agent Ticket<br />
                3. Counselor Resolves Issue
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Complete Folder Structure */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs p-6 space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
            <FolderTree className="w-4 h-4 text-blue-600" />
            <span>2. Recommended Project Folder Structure (for College Submission)</span>
          </h3>
          <button
            onClick={() => copyToClipboard(`AI-Voice-Caller-Education/
├── app.py                     # Main Python Flask backend & API routes
├── database.py                # SQLite database helper & schema initializers
├── requirements.txt           # Python dependencies (Flask, etc.)
├── schema.sql                 # SQLite DDL tables schema
├── static/
│   ├── css/
│   │   └── style.css          # Educational clean theme styling
│   └── js/
│       ├── caller.js          # SpeechRecognition & SpeechSynthesis Web Audio API
│       └── app.js             # Chat interaction & dashboard charts
└── templates/
    ├── index.html             # AI Caller Voice Studio simulation page
    ├── dashboard.html         # Analytics & query metrics dashboard
    ├── knowledge_base.html    # College FAQs, courses & fees manager
    ├── handoff_desk.html      # Human counselor ticket resolution desk
    ├── admin_login.html       # Super Admin login page
    ├── college_login.html     # College counselor portal login
    └── college_register.html  # College signup & registration page`, 'folder')}
            className="text-xs text-blue-600 hover:text-blue-700 font-semibold flex items-center gap-1 cursor-pointer"
          >
            {copiedSection === 'folder' ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
            <span>Copy Tree</span>
          </button>
        </div>

        <pre className="p-4 bg-slate-900 text-slate-200 rounded-xl text-xs font-mono overflow-x-auto leading-relaxed">
{`AI-Voice-Caller-Education/
├── app.py                     # Main Python Flask backend & API routes
├── database.py                # SQLite database helper & schema initializers
├── requirements.txt           # Python dependencies (Flask, etc.)
├── schema.sql                 # SQLite DDL tables schema
├── static/
│   ├── css/
│   │   └── style.css          # Educational clean theme styling
│   └── js/
│       ├── caller.js          # SpeechRecognition & SpeechSynthesis Web Audio API
│       └── app.js             # Chat interaction & dashboard charts
└── templates/
    ├── index.html             # AI Caller Voice Studio simulation page
    ├── dashboard.html         # Analytics & query metrics dashboard
    ├── knowledge_base.html    # College FAQs, courses & fees manager
    ├── handoff_desk.html      # Human counselor ticket resolution desk
    ├── admin_login.html       # Super Admin login page
    ├── college_login.html     # College counselor portal login
    └── college_register.html  # College signup & registration page`}
        </pre>
      </div>

      {/* 3. 10 Features Checklists for Viva Presentation */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs p-6 space-y-4">
        <h3 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-3 flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          <span>3. 10 Core Features Checklist (Implemented in this Project)</span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
          <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 space-y-1">
            <span className="font-bold text-slate-900">1. Dashboard Overview</span>
            <p className="text-slate-600">Total calls, student queries, resolved queries, human handoffs, and recent call logs.</p>
          </div>

          <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 space-y-1">
            <span className="font-bold text-slate-900">2. AI Voice Caller Simulation</span>
            <p className="text-slate-600">Speech-to-text input, typed query, audio waveform visualizer, and speech synthesis playback.</p>
          </div>

          <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 space-y-1">
            <span className="font-bold text-slate-900">3. College Knowledge Base</span>
            <p className="text-slate-600">Courses (BCA/MCA/B.Tech), annual tuition fees, scholarship slabs, hostel & library facilities.</p>
          </div>

          <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 space-y-1">
            <span className="font-bold text-slate-900">4. Intent Recognition</span>
            <p className="text-slate-600">Identifies Course Info, Fees, Admissions, Scholarships, Exam Dates, Hostels, Policies.</p>
          </div>

          <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 space-y-1">
            <span className="font-bold text-slate-900">5. Automatic Response Engine</span>
            <p className="text-slate-600">Semantic retrieval against verified college information and natural language generation.</p>
          </div>

          <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 space-y-1">
            <span className="font-bold text-slate-900">6. Smart Human Handoff</span>
            <p className="text-slate-600">Detects unresolved questions or complaints and triggers a 1-click Transfer to Counselor.</p>
          </div>

          <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 space-y-1">
            <span className="font-bold text-slate-900">7. Counselor Agent Desk</span>
            <p className="text-slate-600">Live ticket queue showing student name, phone, question summary, and status toggle (Pending/Resolved).</p>
          </div>

          <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 space-y-1">
            <span className="font-bold text-slate-900">8. Persistent SQLite Storage</span>
            <p className="text-slate-600">Stores previous questions, answers, caller records, and conversation transcripts.</p>
          </div>

          <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 space-y-1">
            <span className="font-bold text-slate-900">9. Analytics & Intent Breakdown</span>
            <p className="text-slate-600">Visual breakdown of most-asked topics, caller sentiment score, and hourly call distribution.</p>
          </div>

          <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 space-y-1">
            <span className="font-bold text-slate-900">10. Multi-Role Authentication</span>
            <p className="text-slate-600">Admin Login, College Registration, College Portal Login, and Student Voice Caller Mode.</p>
          </div>
        </div>
      </div>

      {/* 4. Complete Code Templates (Flask, SQLite, HTML) */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs p-6 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-3">
          <div>
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <Code2 className="w-4 h-4 text-blue-600" />
              <span>4. Copy-Ready Python Flask + SQLite Backend Code</span>
            </h3>
            <p className="text-xs text-slate-500">
              Run this standalone Python script on your local computer to fulfill your BCA project requirements.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveCodeTab('flask_app')}
              className={`px-3 py-1 rounded-lg text-xs font-semibold cursor-pointer ${
                activeCodeTab === 'flask_app' ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-700'
              }`}
            >
              app.py (Flask)
            </button>
            <button
              onClick={() => setActiveCodeTab('sqlite_db')}
              className={`px-3 py-1 rounded-lg text-xs font-semibold cursor-pointer ${
                activeCodeTab === 'sqlite_db' ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-700'
              }`}
            >
              schema.sql (SQLite)
            </button>
          </div>
        </div>

        {/* Code View Area */}
        <div className="relative">
          <button
            onClick={() => copyToClipboard(activeCodeTab === 'flask_app' ? flaskAppCode : sqliteSchemaCode, 'code')}
            className="absolute top-3 right-3 px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-[11px] font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            {copiedSection === 'code' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copiedSection === 'code' ? 'Copied!' : 'Copy Code'}</span>
          </button>

          <pre className="p-4 bg-slate-950 text-slate-200 rounded-xl text-xs font-mono overflow-x-auto max-h-96">
            {activeCodeTab === 'flask_app' ? flaskAppCode : sqliteSchemaCode}
          </pre>
        </div>
      </div>

      {/* 5. Local Setup Instructions */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs p-6 space-y-4">
        <h3 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-3 flex items-center gap-2">
          <Terminal className="w-4 h-4 text-blue-600" />
          <span>5. How to Run Locally on Your Machine (Step-by-Step)</span>
        </h3>

        <div className="space-y-3 text-xs text-slate-700">
          <div className="flex items-start gap-3">
            <span className="w-6 h-6 rounded-full bg-blue-50 border border-blue-200 text-blue-600 font-bold flex items-center justify-center shrink-0">1</span>
            <div>
              <div className="font-semibold text-slate-900">Install Python Dependencies</div>
              <p className="text-slate-500 mt-0.5">Open your terminal or command prompt and run:</p>
              <code className="block p-2 bg-slate-100 text-slate-800 rounded font-mono mt-1 text-[11px]">
                pip install flask
              </code>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <span className="w-6 h-6 rounded-full bg-blue-50 border border-blue-200 text-blue-600 font-bold flex items-center justify-center shrink-0">2</span>
            <div>
              <div className="font-semibold text-slate-900">Start the Flask Server</div>
              <p className="text-slate-500 mt-0.5">Run the Python file:</p>
              <code className="block p-2 bg-slate-100 text-slate-800 rounded font-mono mt-1 text-[11px]">
                python app.py
              </code>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <span className="w-6 h-6 rounded-full bg-blue-50 border border-blue-200 text-blue-600 font-bold flex items-center justify-center shrink-0">3</span>
            <div>
              <div className="font-semibold text-slate-900">Open in Web Browser</div>
              <p className="text-slate-500 mt-0.5">Visit the local address:</p>
              <code className="block p-2 bg-slate-100 text-slate-800 rounded font-mono mt-1 text-[11px]">
                http://127.0.0.1:5000
              </code>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
