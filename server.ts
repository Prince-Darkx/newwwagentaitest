import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import dotenv from 'dotenv';
import { db } from './server/db.js';
import { processAgentInteraction, generateCallSummaryAndDossier } from './server/geminiService.js';

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// ----------------------------------------------------
// API ROUTES
// ----------------------------------------------------

// Health Check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'online',
    service: 'EduVoice AI Engine',
    timestamp: new Date().toISOString(),
    geminiKeyConfigured: Boolean(process.env.GEMINI_API_KEY)
  });
});

// ----------------------------------------------------
// AUTHENTICATION & MULTI-PORTAL ENDPOINTS
// ----------------------------------------------------

// Admin Login
app.post('/api/auth/admin/login', (req, res) => {
  const { email, password } = req.body;
  if (!email) {
    res.status(400).json({ error: 'Admin email is required' });
    return;
  }
  const result = db.authenticateAdmin(email, password);
  if (!result.success) {
    res.status(401).json({ error: result.error || 'Authentication failed' });
    return;
  }
  res.json({
    success: true,
    user: {
      id: result.admin!.id,
      name: result.admin!.name,
      email: result.admin!.email,
      role: 'super_admin',
      token: `adm-token-${Date.now().toString(36)}`
    }
  });
});

// Plan Configuration
app.get('/api/plans', (req, res) => {
  res.json(db.getPlanConfigs ? db.getPlanConfigs() : {
    Starter: {
      tier: 'Starter',
      name: 'Institutional Starter',
      monthlyPrice: 149,
      yearlyPrice: 1490,
      monthlyCredits: 2500,
      counselorSeats: 2,
      voiceProfilesCount: 1
    },
    Pro: {
      tier: 'Pro',
      name: 'Autonomous Campus Pro',
      monthlyPrice: 399,
      yearlyPrice: 3990,
      monthlyCredits: 10000,
      counselorSeats: 6,
      voiceProfilesCount: 3
    },
    Enterprise: {
      tier: 'Enterprise',
      name: 'National University Enterprise',
      monthlyPrice: 899,
      yearlyPrice: 8990,
      monthlyCredits: 35000,
      counselorSeats: 25,
      voiceProfilesCount: 10
    }
  });
});

// College Registration with Plan selection
app.post('/api/auth/college/register', (req, res) => {
  const {
    collegeName,
    collegeCode,
    email,
    password,
    affiliation,
    phone,
    city,
    state,
    website,
    contactPerson,
    contactDesignation,
    departments,
    subscriptionTier,
    billingCycle
  } = req.body;

  if (!collegeName || !collegeCode || !email || !phone) {
    res.status(400).json({ error: 'College Name, Code, Email, and Phone are required.' });
    return;
  }

  const result = db.registerCollege({
    collegeName,
    collegeCode,
    email,
    password,
    affiliation: affiliation || 'Affiliated Institution',
    phone,
    city: city || 'Campus City',
    state: state || 'State',
    website,
    contactPerson: contactPerson || 'Admissions Counselor',
    contactDesignation: contactDesignation || 'Head of Admissions',
    departments,
    subscriptionTier,
    billingCycle
  });

  if (!result.success) {
    res.status(400).json({ error: result.error });
    return;
  }

  res.status(201).json({
    success: true,
    college: result.college,
    message: 'Institutional registration submitted! Your account is pending Super Admin approval & activation.',
    user: {
      id: result.college!.id,
      name: result.college!.contactPerson,
      email: result.college!.email,
      role: 'college_admin',
      collegeId: result.college!.id,
      collegeName: result.college!.collegeName,
      collegeCode: result.college!.collegeCode,
      subscriptionTier: result.college!.subscriptionTier,
      creditsRemaining: result.college!.creditsRemaining,
      monthlyCreditAllowance: result.college!.monthlyCreditAllowance,
      token: `col-token-${Date.now().toString(36)}`
    }
  });
});

// College Login
app.post('/api/auth/college/login', (req, res) => {
  const { emailOrCode, password } = req.body;
  if (!emailOrCode) {
    res.status(400).json({ error: 'College Email or Code is required.' });
    return;
  }

  const result = db.authenticateCollege(emailOrCode, password);
  if (!result.success) {
    res.status(401).json({ error: result.error || 'Invalid credentials' });
    return;
  }

  const college = result.college!;
  res.json({
    success: true,
    college: {
      id: college.id,
      collegeName: college.collegeName,
      collegeCode: college.collegeCode,
      email: college.email,
      affiliation: college.affiliation,
      phone: college.phone,
      city: college.city,
      state: college.state,
      website: college.website,
      status: college.status,
      departments: college.departments,
      subscriptionTier: college.subscriptionTier,
      billingCycle: college.billingCycle,
      monthlyCreditAllowance: college.monthlyCreditAllowance,
      creditsRemaining: college.creditsRemaining,
      creditsUsed: college.creditsUsed,
      subscriptionRenewsAt: college.subscriptionRenewsAt,
      amountPaid: college.amountPaid
    },
    user: {
      id: college.id,
      name: college.contactPerson || college.collegeName,
      email: college.email,
      role: 'college_admin',
      collegeId: college.id,
      collegeName: college.collegeName,
      collegeCode: college.collegeCode,
      subscriptionTier: college.subscriptionTier,
      creditsRemaining: college.creditsRemaining,
      monthlyCreditAllowance: college.monthlyCreditAllowance,
      token: `col-token-${Date.now().toString(36)}`
    }
  });
});

// List All Registered Colleges (for Admin Portal & Explorer)
app.get('/api/auth/colleges', (req, res) => {
  const list = db.getColleges();
  res.json(list);
});

// Admin approves college subscription request and sets up credits
app.post('/api/admin/colleges/:id/approve', (req, res) => {
  const { id } = req.params;
  const { tier, billingCycle, customCredits } = req.body;
  const updated = db.approveCollegeSubscription(id, tier, billingCycle, customCredits);
  if (!updated) {
    res.status(404).json({ error: 'College not found' });
    return;
  }
  res.json({ success: true, college: updated });
});

// Admin refills credits for a college
app.post('/api/admin/colleges/:id/refill-credits', (req, res) => {
  const { id } = req.params;
  const { amount, note } = req.body;
  const numAmount = parseInt(amount, 10);
  if (isNaN(numAmount) || numAmount <= 0) {
    res.status(400).json({ error: 'Valid positive credit amount is required' });
    return;
  }
  const updated = db.refillCollegeCredits(id, numAmount, note);
  if (!updated) {
    res.status(404).json({ error: 'College not found' });
    return;
  }
  res.json({ success: true, college: updated, message: `Successfully added ${numAmount.toLocaleString()} credits to ${updated.collegeName}` });
});

// Admin directly accesses / impersonates a college portal
app.post('/api/admin/impersonate/:id', (req, res) => {
  const { id } = req.params;
  const college = db.getCollegeById ? db.getCollegeById(id) : db.getColleges().find(c => c.id === id);
  if (!college) {
    res.status(404).json({ error: 'College not found' });
    return;
  }
  res.json({
    success: true,
    user: {
      id: college.id,
      name: `Admin Access: ${college.collegeName}`,
      email: college.email,
      role: 'college_admin',
      collegeId: college.id,
      collegeName: college.collegeName,
      collegeCode: college.collegeCode,
      subscriptionTier: college.subscriptionTier,
      creditsRemaining: college.creditsRemaining,
      monthlyCreditAllowance: college.monthlyCreditAllowance,
      token: `impersonate-${college.id}-${Date.now().toString(36)}`
    },
    college,
    isSuperAdminImpersonating: true
  });
});

// Deduct credits on call usage
app.post('/api/colleges/:id/deduct-credits', (req, res) => {
  const { id } = req.params;
  const { minutes } = req.body;
  const result = db.deductCollegeCredits(id, minutes || 1);
  res.json(result);
});

// Update plan
app.post('/api/colleges/:id/update-plan', (req, res) => {
  const { id } = req.params;
  const { tier, billingCycle } = req.body;
  const updated = db.updateCollegePlan(id, tier, billingCycle);
  if (!updated) {
    res.status(404).json({ error: 'College not found' });
    return;
  }
  res.json({ success: true, college: updated });
});

// Admin updates college approval status
app.patch('/api/auth/colleges/:id/status', (req, res) => {
  const { id } = req.params;
  const { status } = req.body;
  if (!status || !['Active', 'Pending_Approval', 'Suspended', 'Expired'].includes(status)) {
    res.status(400).json({ error: 'Valid status is required' });
    return;
  }
  const updated = db.updateCollegeStatus(id, status);
  if (!updated) {
    res.status(404).json({ error: 'College not found' });
    return;
  }
  res.json(updated);
});

// AI Agent Voice Interaction (Core Engine)
app.post('/api/agent/interact', async (req, res) => {
  try {
    const {
      callerName,
      callerPhone,
      callerRole,
      interestProgram,
      userSpeech,
      conversationHistory,
      selectedLanguage,
      callDirection
    } = req.body;

    if (!userSpeech || typeof userSpeech !== 'string') {
      res.status(400).json({ error: 'userSpeech is required' });
      return;
    }

    const result = await processAgentInteraction({
      callerName: callerName || 'Student',
      callerPhone: callerPhone || '+1 (555) 000-0000',
      callerRole: callerRole || 'Student',
      interestProgram: interestProgram || 'B.Tech / MBA Programs',
      userSpeech,
      conversationHistory: conversationHistory || [],
      selectedLanguage: selectedLanguage || 'en-US',
      callDirection: callDirection || 'inbound'
    });

    res.json(result);
  } catch (err: any) {
    console.error('API /api/agent/interact error:', err);
    res.status(500).json({ error: err.message || 'Internal Agent Error' });
  }
});

// Call Summarization & Dossier Generation
app.post('/api/agent/summarize', async (req, res) => {
  try {
    const { transcript, caller } = req.body;
    const summary = await generateCallSummaryAndDossier(transcript || [], caller || { name: 'Student', phone: '', role: 'Student' });
    res.json(summary);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// Agent Settings
app.get('/api/agent/settings', (req, res) => {
  res.json(db.getSettings());
});

app.put('/api/agent/settings', (req, res) => {
  const updated = db.updateSettings(req.body);
  res.json(updated);
});

// Knowledge Base Endpoints (CRUD)
app.get('/api/knowledge-base', (req, res) => {
  const { query, category } = req.query;
  const items = db.getKnowledgeBase(query as string, category as string);
  res.json(items);
});

app.post('/api/knowledge-base', (req, res) => {
  try {
    const { category, categoryName, title, keywords, content, tags } = req.body;
    if (!title || !content || !category) {
      res.status(400).json({ error: 'Title, content, and category are required' });
      return;
    }
    const created = db.addKnowledgeItem({
      category,
      categoryName: categoryName || 'General',
      title,
      keywords: Array.isArray(keywords) ? keywords : (keywords || '').split(',').map((k: string) => k.trim()),
      content,
      tags: Array.isArray(tags) ? tags : (tags || '').split(',').map((t: string) => t.trim())
    });
    res.status(201).json(created);
  } catch (e: any) {
    res.status(500).json({ error: e.message });
  }
});

app.put('/api/knowledge-base/:id', (req, res) => {
  const { id } = req.params;
  const updated = db.updateKnowledgeItem(id, req.body);
  if (!updated) {
    res.status(404).json({ error: 'Knowledge item not found' });
    return;
  }
  res.json(updated);
});

app.delete('/api/knowledge-base/:id', (req, res) => {
  const { id } = req.params;
  const success = db.deleteKnowledgeItem(id);
  res.json({ success });
});

// Student CRM Directory Endpoints
app.get('/api/students', (req, res) => {
  const { search, status } = req.query;
  const list = db.getStudents(search as string, status as string);
  res.json(list);
});

app.get('/api/students/:id', (req, res) => {
  const student = db.getStudentById(req.params.id);
  if (!student) {
    res.status(404).json({ error: 'Student not found' });
    return;
  }
  res.json(student);
});

app.post('/api/students', (req, res) => {
  const created = db.addStudent(req.body);
  res.status(201).json(created);
});

app.put('/api/students/:id', (req, res) => {
  const updated = db.updateStudent(req.params.id, req.body);
  if (!updated) {
    res.status(404).json({ error: 'Student not found' });
    return;
  }
  res.json(updated);
});

// Call Records Endpoints
app.get('/api/calls', (req, res) => {
  const { status, search } = req.query;
  const calls = db.getCalls({ status: status as string, search: search as string });
  res.json(calls);
});

app.get('/api/calls/:id', (req, res) => {
  const call = db.getCallById(req.params.id);
  if (!call) {
    res.status(404).json({ error: 'Call record not found' });
    return;
  }
  res.json(call);
});

app.post('/api/calls', (req, res) => {
  const record = db.saveCallRecord(req.body);
  res.status(201).json(record);
});

// Handoff Live Queue Endpoints
app.get('/api/handoff/queue', (req, res) => {
  const { status } = req.query;
  const handoffs = db.getHandoffs(status as string);
  res.json(handoffs);
});

app.post('/api/handoff/queue', (req, res) => {
  const ticket = db.createHandoffTicket(req.body);
  res.status(201).json(ticket);
});

app.put('/api/handoff/:id', (req, res) => {
  const updated = db.updateHandoffTicket(req.params.id, req.body);
  if (!updated) {
    res.status(404).json({ error: 'Handoff ticket not found' });
    return;
  }
  res.json(updated);
});

// Analytics Dashboard Endpoint
app.get('/api/analytics', (req, res) => {
  const stats = db.getAnalytics();
  res.json(stats);
});

// Action Integrations (WhatsApp, SMS, Email, Payment Link dispatch)
app.post('/api/integrations/action', (req, res) => {
  const { type, recipient, details, callId, title } = req.body;
  
  // Real simulated dispatched transaction log
  const actionLog = {
    id: `act-${Date.now().toString(36)}`,
    type: type || 'whatsapp',
    title: title || 'Information Dispatched',
    recipient: recipient || '+1 (555) 000-0000',
    details: details || 'Official admissions brochure dispatched.',
    sentAt: new Date().toISOString(),
    status: 'Delivered',
    providerRef: `MSG-${Math.random().toString(36).substring(2, 9).toUpperCase()}`
  };

  if (callId) {
    const call = db.getCallById(callId);
    if (call) {
      call.actionDispatched = {
        type: actionLog.type,
        recipient: actionLog.recipient,
        sentAt: actionLog.sentAt,
        details: actionLog.details
      };
      db.saveCallRecord(call);
    }
  }

  res.json({
    success: true,
    action: actionLog,
    message: `Official ${type.toUpperCase()} package dispatched successfully to ${recipient}`
  });
});

// ----------------------------------------------------
// VITE & STATIC SERVING CONFIGURATION
// ----------------------------------------------------
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`EduVoice AI Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer().catch(err => {
  console.error('Failed to start server:', err);
});
