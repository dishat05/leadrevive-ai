import mongoose, { Schema, type Document, type Types } from 'mongoose';

export type LeadSource = 'ad' | 'form' | 'referral' | 'manual';
export type LeadStatus = 'new' | 'contacted' | 'qualified' | 'hot' | 'warm' | 'cold' | 'converted';
export type LeadLanguage = 'en' | 'hi' | 'other';
export type ConversationSender = 'lead' | 'bot' | 'rep';

export interface ConversationMessage {
  sender: ConversationSender;
  message: string;
  timestamp: Date;
}

export interface ILead extends Document {
  _id: Types.ObjectId;
  userId: Types.ObjectId;
  name: string;
  phone: string;
  email?: string;
  source: LeadSource;
  status: LeadStatus;
  budget?: string;
  intent?: string;
  timeline?: string;
  language: LeadLanguage;
  qualificationSummary?: string;
  notes?: string;
  conversation: ConversationMessage[];
  followUp: {
    scheduledAt?: Date;
    sent: boolean;
  };
  callBookedAt?: Date;
  isDeleted: boolean;
  createdAt: Date;
  updatedAt: Date;
  lastContactedAt: Date;
}

const conversationSchema = new Schema<ConversationMessage>(
  {
    sender: { type: String, enum: ['lead', 'bot', 'rep'], required: true },
    message: { type: String, required: true },
    timestamp: { type: Date, default: Date.now },
  },
  { _id: false }
);

const leadSchema = new Schema<ILead>(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    name: { type: String, required: true, trim: true },
    phone: { type: String, required: true, trim: true },
    email: { type: String, trim: true, lowercase: true },
    source: { type: String, enum: ['ad', 'form', 'referral', 'manual'], required: true },
    status: {
      type: String,
      enum: ['new', 'contacted', 'qualified', 'hot', 'warm', 'cold', 'converted'],
      default: 'new',
    },
    budget: { type: String },
    intent: { type: String },
    timeline: { type: String },
    language: { type: String, enum: ['en', 'hi', 'other'], default: 'en' },
    qualificationSummary: { type: String },
    notes: { type: String },
    conversation: { type: [conversationSchema], default: [] },
    followUp: {
      scheduledAt: { type: Date },
      sent: { type: Boolean, default: false },
    },
    callBookedAt: { type: Date },
    isDeleted: { type: Boolean, default: false },
    lastContactedAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

leadSchema.index({ userId: 1, isDeleted: 1, status: 1 });
leadSchema.index({ name: 'text', phone: 'text' });

export const Lead = mongoose.model<ILead>('Lead', leadSchema);

export function sanitizeLead(lead: ILead) {
  return {
    _id: lead._id.toString(),
    userId: lead.userId.toString(),
    name: lead.name,
    phone: lead.phone,
    email: lead.email,
    source: lead.source,
    status: lead.status,
    budget: lead.budget,
    intent: lead.intent,
    timeline: lead.timeline,
    language: lead.language,
    qualificationSummary: lead.qualificationSummary,
    notes: lead.notes,
    conversation: lead.conversation,
    followUp: lead.followUp,
    callBookedAt: lead.callBookedAt,
    createdAt: lead.createdAt,
    lastContactedAt: lead.lastContactedAt,
  };
}
