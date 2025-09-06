import { Router } from 'express';
import auth from '../middleware/auth.js';
import {
  createFolder,
  myFolders,
  addCollaborator,
  getFolderDetails,
  explorePublic
} from '../controllers/folderController.js';

const router = Router();

// PUBLIC explore endpoint (no auth)
router.get('/explore', explorePublic);

// Everything below requires auth
router.use(auth);
router.post('/', createFolder);
router.get('/mine', myFolders);
router.post('/collaborators', addCollaborator);
router.get('/:id', getFolderDetails);

export default router;
