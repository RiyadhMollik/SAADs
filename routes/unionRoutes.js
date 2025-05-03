import express from 'express';
import { getUnions, getUnionById, createUnion, updateUnion, deleteUnion } from '../controllers/unionController.js';

const router = express.Router();

router.get('/', getUnions);
router.get('/:id', getUnionById);
router.post('/', createUnion);
router.put('/:id', updateUnion);
router.delete('/:id', deleteUnion);

export default router;
