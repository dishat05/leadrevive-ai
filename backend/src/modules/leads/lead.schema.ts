import { z } from 'zod';

const leadSourceEnum = z.enum(['ad', 'form', 'referral', 'manual']);
const leadStatusEnum = z.enum(['new', 'contacted', 'qualified', 'hot', 'warm', 'cold', 'converted']);

export const createLeadSchema = z.object({
  name: z.string().min(1, 'Name is required').max(200),
  phone: z.string().min(5, 'Phone is required').max(20),
  email: z.email('Invalid email').optional(),
  source: leadSourceEnum,
  message: z.string().max(2000).optional(),
});

export const updateLeadSchema = z.object({
  status: leadStatusEnum.optional(),
  notes: z.string().max(5000).optional(),
  message: z.string().max(2000).optional(),
});

export const listLeadsQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(20),
  status: leadStatusEnum.optional(),
  search: z.string().max(100).optional(),
});

export const leadIdParamSchema = z.object({
  id: z.string().regex(/^[a-f\d]{24}$/i, 'Invalid lead id'),
});

export const qualifyLeadSchema = z.object({
  message: z.string().max(2000).optional(),
});

export type CreateLeadInput = z.infer<typeof createLeadSchema>;
export type UpdateLeadInput = z.infer<typeof updateLeadSchema>;
export type ListLeadsQuery = z.infer<typeof listLeadsQuerySchema>;
