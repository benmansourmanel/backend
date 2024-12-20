import express from 'express';
import { getReclamationsByEnseignant, deleteReclamation, repondreReclamation, createReclamation } from '../controllers/reclamationController.js';
import { authenticateJWT, verifyEnseignant } from '../middelwares/authMiddleware.js'; // Correction du nom du dossier

const router = express.Router();

// Corrected route for getting all reclamations for an enseignant
router.get('/', authenticateJWT, verifyEnseignant, getReclamationsByEnseignant);
router.post('/', authenticateJWT, verifyEnseignant, createReclamation);

// Other routes...
router.delete('/:id', authenticateJWT, verifyEnseignant, deleteReclamation);
router.put('/:id/repondre', authenticateJWT, verifyEnseignant, repondreReclamation);


export default router;
