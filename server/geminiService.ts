import { GoogleGenAI } from '@google/genai';
import { db } from './db.js';
import { SentimentState, TranscriptMessage } from '../src/types.js';

let aiClient: GoogleGenAI | null = null;

function getAIClient(): GoogleGenAI | null {
  if (!aiClient && process.env.GEMINI_API_KEY) {
    try {
      aiClient = new GoogleGenAI({
        apiKey: process.env.GEMINI_API_KEY,
        httpOptions: {
          headers: {
            'User-Agent': 'aistudio-build',
          },
        },
      });
    } catch (err) {
      console.warn('Failed to initialize GoogleGenAI client:', err);
    }
  }
  return aiClient;
}

export interface AgentInteractionRequest {
  callerName: string;
  callerPhone: string;
  callerRole: string;
  interestProgram?: string;
  userSpeech: string;
  conversationHistory: TranscriptMessage[];
  selectedLanguage?: string;
  callDirection?: 'inbound' | 'outbound';
}

export interface AgentInteractionResponse {
  replyText: string;
  detectedIntent: string;
  intentList: string[];
  sentiment: SentimentState;
  sentimentScore: number;
  handoffRecommended: boolean;
  handoffReason?: string;
  handoffPriority?: 'normal' | 'high' | 'critical';
  sourcesRetrieved: string[];
  suggestedAction?: {
    type: 'whatsapp' | 'sms' | 'email' | 'payment_link';
    title: string;
    details: string;
  };
}

// Helper to perform semantic / keyword match on Knowledge Base items
function retrieveKnowledgeContext(query: string): { items: any[]; sources: string[]; textContext: string } {
  const allKB = db.getKnowledgeBase();
  const q = query.toLowerCase();
  const scored = allKB.map(kb => {
    let score = 0;
    const titleMatch = kb.title.toLowerCase();
    const contentMatch = kb.content.toLowerCase();
    
    // Check keywords
    kb.keywords.forEach(kw => {
      if (q.includes(kw.toLowerCase())) score += 5;
    });
    // Check title words
    kb.title.split(' ').forEach(w => {
      if (w.length > 3 && q.includes(w.toLowerCase())) score += 3;
    });
    // Check tags
    kb.tags.forEach(t => {
      if (q.includes(t.toLowerCase())) score += 4;
    });
    if (contentMatch.includes(q)) score += 8;

    return { ...kb, matchScore: score };
  });

  const relevant = scored.filter(s => s.matchScore > 0).sort((a, b) => b.matchScore - a.matchScore).slice(0, 4);
  const selected = relevant.length > 0 ? relevant : allKB.slice(0, 3);

  const sources = selected.map(s => s.title);
  const textContext = selected.map(s => `[${s.categoryName}] ${s.title}:\n${s.content}`).join('\n\n');

  return { items: selected, sources, textContext };
}

export async function processAgentInteraction(req: AgentInteractionRequest): Promise<AgentInteractionResponse> {
  const { callerName, callerPhone, callerRole, interestProgram, userSpeech, conversationHistory, selectedLanguage, callDirection } = req;
  const ai = getAIClient();
  const { sources, textContext } = retrieveKnowledgeContext(userSpeech);

  const historyContext = conversationHistory.slice(-8).map(msg => `${msg.sender.toUpperCase()}: ${msg.text}`).join('\n');

  const systemInstruction = `You are Maya, the world-class, empathetic, and professional AI Voice Caller Agent for Apex Institute of Higher Education & Technology (AIHT).
Your role is to handle voice phone calls with prospective students, parents, and applicants.

VOICE & SPEECH RULES:
1. Speak in a natural, friendly, conversational voice tone suitable for spoken audio playback (TTS).
2. DO NOT use markdown symbols, asterisks (no **bold**), bullet stars, or robotic lists. Write flowing natural sentences.
3. Keep responses concise, clear, and focused (2 to 4 spoken sentences) so the caller does not get overwhelmed listening on the phone.
4. Greet or address the caller respectfully (e.g. by their name "${callerName || 'Student'}" or "Mr./Ms." if parent).
5. Ground all facts in the provided INSTITUTION KNOWLEDGE BASE. If the exact detail is not known, offer to connect them to a human admissions counselor or dispatch the official brochure to their WhatsApp.

HANDOFF TO HUMAN RULES (CRITICAL):
- If the caller explicitly requests a human advisor, counselor, dean, supervisor, or real person ("transfer me", "let me talk to an advisor", "human please"): IMMEDIATELY recommend handoff (handoffRecommended: true) and politely acknowledge the transfer.
- If the caller exhibits strong frustration, anger, or repeated confusion: Set handoffRecommended: true with high priority.
- If the query involves complex personal disputes, legal, or non-standard refund approvals: Recommend handoff.

INTEGRATION ACTIONS:
- If caller asks for fee payment link, scholarship checklist, syllabus PDF, or campus location on WhatsApp/SMS: provide suggestedAction object with type ('whatsapp' | 'sms' | 'email' | 'payment_link') and concise text.

OUTPUT FORMAT:
You MUST respond with a pure JSON object adhering to this schema:
{
  "replyText": "Spoken voice response to the caller without any markdown formatting",
  "detectedIntent": "Primary intent (e.g. Fees & Installments, Scholarship Eligibility, Course Syllabus, Hostel Accommodation, Admission Deadline, Human Handoff, Placement Records)",
  "intentList": ["Array", "of", "detected", "sub-intents"],
  "sentiment": "Happy" | "Inquisitive" | "Neutral" | "Confused" | "Frustrated" | "Angry",
  "sentimentScore": number between -1.0 (very negative) and 1.0 (very positive),
  "handoffRecommended": boolean,
  "handoffReason": "Brief explanation if handoff is triggered or empty string",
  "handoffPriority": "normal" | "high" | "critical",
  "suggestedAction": {
    "type": "whatsapp" | "sms" | "email" | "payment_link",
    "title": "Action title",
    "details": "Details of payload sent"
  } or null
}`;

  const prompt = `Caller Information:
- Name: ${callerName || 'Caller'}
- Phone: ${callerPhone || 'Unknown'}
- Role: ${callerRole || 'Student'}
- Interested Program: ${interestProgram || 'Not specified'}
- Call Direction: ${callDirection || 'inbound'}
- Target Language: ${selectedLanguage || 'English'}

INSTITUTION KNOWLEDGE BASE CONTEXT:
${textContext}

RECENT CONVERSATION HISTORY:
${historyContext || 'Call just initiated'}

CURRENT USER SPEECH INPUT:
"${userSpeech}"

Generate the JSON voice agent response now.`;

  if (ai) {
    try {
      const response = await ai.models.generateContent({
        model: 'gemini-3.7-flash',
        contents: prompt,
        config: {
          systemInstruction,
          responseMimeType: 'application/json',
          temperature: 0.3,
        }
      });

      const text = response.text?.trim();
      if (text) {
        const parsed = JSON.parse(text);
        return {
          replyText: cleanSpeechText(parsed.replyText || 'I would be delighted to assist you with your admissions journey at Apex Institute.'),
          detectedIntent: parsed.detectedIntent || 'Admissions Inquiry',
          intentList: parsed.intentList || ['Admissions'],
          sentiment: (parsed.sentiment as SentimentState) || 'Inquisitive',
          sentimentScore: typeof parsed.sentimentScore === 'number' ? parsed.sentimentScore : 0.7,
          handoffRecommended: Boolean(parsed.handoffRecommended),
          handoffReason: parsed.handoffReason || undefined,
          handoffPriority: parsed.handoffPriority || 'normal',
          sourcesRetrieved: sources,
          suggestedAction: parsed.suggestedAction || undefined
        };
      }
    } catch (err) {
      console.error('Gemini generateContent error, falling back to rule-based engine:', err);
    }
  }

  // Robust Rule-based & Knowledge Grounded Fallback
  return generateFallbackResponse(userSpeech, callerName, sources, textContext);
}

function cleanSpeechText(text: string): string {
  return text
    .replace(/\*\*/g, '')
    .replace(/\*/g, '')
    .replace(/#{1,6}\s?/g, '')
    .replace(/`{1,3}/g, '')
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
    .trim();
}

function generateFallbackResponse(
  userSpeech: string,
  callerName: string,
  sources: string[],
  textContext: string
): AgentInteractionResponse {
  const q = userSpeech.toLowerCase();
  const name = callerName ? callerName.split(' ')[0] : 'there';

  // Check for Human Handoff triggers
  const handoffKeywords = ['human', 'advisor', 'counselor', 'agent', 'person', 'representative', 'transfer', 'supervisor', 'talk to someone', 'frustrated', 'angry', 'complaint'];
  const wantsHandoff = handoffKeywords.some(k => q.includes(k));

  if (wantsHandoff) {
    return {
      replyText: `I completely understand, ${name}. I am immediately connecting you to one of our Senior Admissions Counselors. Please stay on the line while I transfer your details with zero hold time.`,
      detectedIntent: 'Human Counselor Handoff',
      intentList: ['Human Handoff', 'Priority Assistance'],
      sentiment: q.includes('angry') || q.includes('frustrated') ? 'Frustrated' : 'Neutral',
      sentimentScore: -0.3,
      handoffRecommended: true,
      handoffReason: 'Caller requested live human counselor assistance',
      handoffPriority: 'high',
      sourcesRetrieved: sources,
      suggestedAction: {
        type: 'whatsapp',
        title: 'Counselor Contact Dossier',
        details: `Live handoff ticket created for ${callerName}. Counselor dispatched.`
      }
    };
  }

  // Fees & Installments
  if (q.includes('fee') || q.includes('cost') || q.includes('tuition') || q.includes('installment') || q.includes('emi') || q.includes('pay')) {
    return {
      replyText: `Tuition at Apex Institute for B.Tech CSE is ₹2,75,000 per year, and our MBA Tech program is ₹4,20,000 per year. We also offer 3 flexible term installments and zero-interest monthly EMI through our banking partners. Would you like me to send the complete fee structure to your WhatsApp?`,
      detectedIntent: 'Fees & Installments',
      intentList: ['Tuition Fees', 'Installment Plans', 'Payment Gateway'],
      sentiment: 'Inquisitive',
      sentimentScore: 0.65,
      handoffRecommended: false,
      sourcesRetrieved: ['Annual Tuition Fee Structure (2026-2027 Academic Session)'],
      suggestedAction: {
        type: 'whatsapp',
        title: 'Fee Structure PDF',
        details: 'Dispatched 2026-2027 Fee Schedule and Installment Application via WhatsApp.'
      }
    };
  }

  // Scholarships
  if (q.includes('scholarship') || q.includes('waiver') || q.includes('merit') || q.includes('discount') || q.includes('financial aid')) {
    return {
      replyText: `Yes, ${name}! Apex Institute offers up to a 75% tuition waiver under the Apex Chairman Merit Scholarship for students with over 95% in 10+2 PCM or top JEE rank, and a 50% waiver for scores between 90 and 94%. We also have a 25% Women in STEM scholarship!`,
      detectedIntent: 'Scholarships & Merit Aid',
      intentList: ['Merit Scholarship', 'Women in STEM', 'Financial Aid'],
      sentiment: 'Happy',
      sentimentScore: 0.85,
      handoffRecommended: false,
      sourcesRetrieved: ['Merit & Need-Based Scholarships Program'],
      suggestedAction: {
        type: 'whatsapp',
        title: 'Scholarship Eligibility Form',
        details: 'Direct scholarship evaluation form link sent to caller phone.'
      }
    };
  }

  // Hostels & Facilities
  if (q.includes('hostel') || q.includes('accommodation') || q.includes('room') || q.includes('food') || q.includes('mess') || q.includes('gym') || q.includes('wifi')) {
    return {
      replyText: `Our campus provides premium residential towers with twin-sharing AC rooms at ₹1,10,000 per year and single studio rooms at ₹1,45,000 per year. This includes 4 nutritious meals daily, high-speed Wi-Fi, laundry, and 24/7 medical care with security.`,
      detectedIntent: 'Hostel & Campus Facilities',
      intentList: ['Hostel Accommodation', 'Dining Mess', 'Campus Security'],
      sentiment: 'Inquisitive',
      sentimentScore: 0.75,
      handoffRecommended: false,
      sourcesRetrieved: ['Hostel Accommodation, Dining & Campus Life Facilities']
    };
  }

  // Admissions & Dates
  if (q.includes('apply') || q.includes('admission') || q.includes('deadline') || q.includes('date') || q.includes('eligibility') || q.includes('entrance')) {
    return {
      replyText: `Round 2 admissions for the 2026 academic batch are currently open until October 15th, 2026. The process takes place online through our admissions portal with your 10th and 12th marksheets, and offer letters are issued within 48 hours of verification.`,
      detectedIntent: 'Admission & Eligibility Process',
      intentList: ['Admissions 2026', 'Deadlines', 'Document Verification'],
      sentiment: 'Inquisitive',
      sentimentScore: 0.8,
      handoffRecommended: false,
      sourcesRetrieved: ['Admission Process, Important Dates & Eligibility for 2026'],
      suggestedAction: {
        type: 'sms',
        title: 'Admission Portal Link',
        details: 'Sent online registration link and document checklist via SMS.'
      }
    };
  }

  // Placements
  if (q.includes('placement') || q.includes('job') || q.includes('salary') || q.includes('package') || q.includes('company') || q.includes('recruiter')) {
    return {
      replyText: `Our 2025 placement season achieved a 96.4% placement record with an average package of ₹12.8 LPA and a highest international package of ₹54.2 LPA. Top recruiting partners include Google, Microsoft, Amazon, Goldman Sachs, and Deloitte!`,
      detectedIntent: 'Placement Records & Careers',
      intentList: ['Placement Statistics', 'Top Recruiters', 'Average Package'],
      sentiment: 'Happy',
      sentimentScore: 0.9,
      handoffRecommended: false,
      sourcesRetrieved: ['Placement Statistics & Top Recruiters']
    };
  }

  // Default contextual greeting/clarification
  return {
    replyText: `Thank you for sharing, ${name}. At Apex Institute, we offer top-ranked engineering, management, design, and data science programs. How can I help you with program details, fee installments, scholarships, or campus visits today?`,
    detectedIntent: 'General Academic Inquiry',
    intentList: ['Overview', 'Program Information'],
    sentiment: 'Neutral',
    sentimentScore: 0.6,
    handoffRecommended: false,
    sourcesRetrieved: sources.slice(0, 2)
  };
}

// Generate Call Summary and Warm Transfer Dossier for Human Counselors
export async function generateCallSummaryAndDossier(transcript: TranscriptMessage[], caller: { name: string; phone: string; role: string; program?: string }) {
  const ai = getAIClient();
  const transcriptText = transcript.map(t => `${t.sender}: ${t.text}`).join('\n');

  if (ai && transcript.length > 0) {
    try {
      const response = await ai.models.generateContent({
        model: 'gemini-3.7-flash',
        contents: `Summarize this education admissions phone call transcript into a crisp 2-sentence executive summary and 2 key action items for the CRM record.
Caller: ${caller.name} (${caller.role}, interested in ${caller.program || 'Programs'})

Transcript:
${transcriptText}`,
        config: {
          responseMimeType: 'application/json',
          responseSchema: {
            type: 'OBJECT' as any,
            properties: {
              summary: { type: 'STRING' as any, description: '2 sentence concise call summary' },
              keyActionItems: { type: 'ARRAY' as any, items: { type: 'STRING' as any }, description: 'Action items for counselor' },
              disposition: { type: 'STRING' as any, description: 'Call outcome disposition category' }
            },
            required: ['summary', 'keyActionItems', 'disposition']
          }
        }
      });

      const parsed = JSON.parse(response.text?.trim() || '{}');
      if (parsed.summary) return parsed;
    } catch (e) {
      console.warn('AI summary generation fallback:', e);
    }
  }

  return {
    summary: `Call with ${caller.name} completed. Discussed academic admissions, program eligibility, and campus facilities.`,
    keyActionItems: ['Follow up with fee breakdown on WhatsApp', 'Schedule campus tour counselor appointment'],
    disposition: 'Counseling Follow-up'
  };
}
