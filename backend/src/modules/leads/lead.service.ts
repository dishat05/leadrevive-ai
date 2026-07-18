import { Lead, sanitizeLead, type ILead } from './lead.model.js';
import { assertOwnership } from '../../utils/ownershipCheck.js';
import type { CreateLeadInput, UpdateLeadInput, ListLeadsQuery } from './lead.schema.js';

const notDeleted = { isDeleted: false };

export async function createLead(userId: string, input: CreateLeadInput) {
  const conversation = input.message
    ? [{ sender: 'lead' as const, message: input.message, timestamp: new Date() }]
    : [];

  const lead = await Lead.create({
    userId,
    name: input.name,
    phone: input.phone,
    email: input.email,
    source: input.source,
    status: 'new',
    language: 'en',
    conversation,
    followUp: { sent: false },
    isDeleted: false,
    lastContactedAt: new Date(),
  });

  return sanitizeLead(lead);
}

export async function listLeads(userId: string, query: ListLeadsQuery) {
  const filter: Record<string, unknown> = {
    userId,
    ...notDeleted,
  };

  if (query.status) {
    filter.status = query.status;
  }

  if (query.search) {
    filter.$or = [
      { name: { $regex: query.search, $options: 'i' } },
      { phone: { $regex: query.search, $options: 'i' } },
    ];
  }

  const skip = (query.page - 1) * query.limit;
  const [leads, total] = await Promise.all([
    Lead.find(filter).sort({ createdAt: -1 }).skip(skip).limit(query.limit),
    Lead.countDocuments(filter),
  ]);

  return {
    data: leads.map(sanitizeLead),
    pagination: {
      total,
      page: query.page,
      limit: query.limit,
      totalPages: Math.ceil(total / query.limit) || 1,
    },
  };
}

export async function getLeadById(userId: string, leadId: string) {
  const lead = await assertOwnership(Lead, leadId, userId, notDeleted);
  return sanitizeLead(lead);
}

export async function updateLead(userId: string, leadId: string, input: UpdateLeadInput) {
  const lead = await assertOwnership(Lead, leadId, userId, notDeleted);

  if (input.status) lead.status = input.status;
  if (input.notes !== undefined) lead.notes = input.notes;

  if (input.message) {
    lead.conversation.push({
      sender: 'rep',
      message: input.message,
      timestamp: new Date(),
    });
    lead.lastContactedAt = new Date();
  }

  await lead.save();
  return sanitizeLead(lead);
}

export async function softDeleteLead(userId: string, leadId: string) {
  const lead = await assertOwnership(Lead, leadId, userId, notDeleted);
  lead.isDeleted = true;
  await lead.save();
  return { message: 'Lead deleted successfully' };
}

export async function bookCall(userId: string, leadId: string) {
  const lead = await assertOwnership(Lead, leadId, userId, notDeleted);
  lead.callBookedAt = new Date();
  await lead.save();
  return {
    leadId: lead._id.toString(),
    callBookedAt: lead.callBookedAt,
    message: 'Call booked successfully (demo confirmation)',
  };
}

export async function getLeadDocument(userId: string, leadId: string): Promise<ILead> {
  return assertOwnership(Lead, leadId, userId, notDeleted);
}

export async function saveLeadDocument(lead: ILead) {
  await lead.save();
  return sanitizeLead(lead);
}
