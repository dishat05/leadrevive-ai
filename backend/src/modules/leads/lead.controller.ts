import { Request, Response, NextFunction } from 'express';
import { apiResponse } from '../../utils/apiResponse.js';
import { createLead, listLeads, getLeadById, updateLead, softDeleteLead } from './lead.service.js';
import { createLeadSchema, updateLeadSchema, listLeadsQuerySchema, leadIdParamSchema } from './lead.schema.js';

export async function createLeadHandler(req: Request, res: Response, next: NextFunction) {
  try {
    const userId = req.user?._id;
    if (!userId) return res.status(401).json(apiResponse(false, null));
    const input = createLeadSchema.parse(req.body);
    const lead = await createLead(userId, input);
    res.status(201).json(apiResponse(true, lead));
  } catch (error) { next(error); }
}

export async function listLeadsHandler(req: Request, res: Response, next: NextFunction) {
  try {
    const userId = req.user?._id;
    if (!userId) return res.status(401).json(apiResponse(false, null));
    const result = await listLeads(userId, { page: 1, limit: 20 });
    res.json(apiResponse(true, result));
  } catch (error) { next(error); }
}
export async function getLeadHandler(req: Request, res: Response, next: NextFunction) {
  try {
    const userId = req.user?._id;
    if (!userId) return res.status(401).json(apiResponse(false, null));
    const { id } = leadIdParamSchema.parse(req.params);
    const lead = await getLeadById(userId, id);
    res.json(apiResponse(true, lead));
  } catch (error) { next(error); }
}

export async function updateLeadHandler(req: Request, res: Response, next: NextFunction) {
  try {
    const userId = req.user?._id;
    if (!userId) return res.status(401).json(apiResponse(false, null));
    const { id } = leadIdParamSchema.parse(req.params);
    const lead = await updateLead(userId, id, req.body);
    res.json(apiResponse(true, lead));
  } catch (error) { next(error); }
}

export async function deleteLeadHandler(req: Request, res: Response, next: NextFunction) {
  try {
    const userId = req.user?._id;
    if (!userId) return res.status(401).json(apiResponse(false, null));
    const { id } = leadIdParamSchema.parse(req.params);
    const result = await softDeleteLead(userId, id);
    res.json(apiResponse(true, result));
  } catch (error) { next(error); }
}