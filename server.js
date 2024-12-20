import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import morgan from 'morgan';
import dotenv from 'dotenv';
import authRoutes from './routes/auth.js';
import absenceRoutes from './routes/absenceRoutes.js';
import cahierClasseRoutes from './routes/cahierClasseRoutes.js';
import chargeHoraireRoutes from './routes/chargeHoraireRoutes.js';
import reclamationRoutes from './routes/reclamationRoutes.js';  
import passwordRoutes from './routes/passwordRoutes.js';  

import { authenticateJWT } from './middelwares/authMiddleware.js';

dotenv.config();

const app = express();
const hostname = '127.0.0.1';
const port = process.env.PORT || 5000;
const dataBaseName = 'enseignantesprit';

// Connexion à MongoDB
mongoose.set('debug', true);
mongoose.Promise = global.Promise;
mongoose
  .connect(`mongodb://127.0.0.1:27017/${dataBaseName}`, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log(`Connected to ${dataBaseName}`);
  })
  .catch(err => {
    console.log('Error connecting to database:', err);
  });

// Middleware
app.use(cors());
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes publiques
app.use('/api/auth', authRoutes);

// Routes protégées
app.use('/api/absences', authenticateJWT, absenceRoutes);
app.use('/api/cahierClasse', authenticateJWT, cahierClasseRoutes);
app.use('/api/chargeHoraire', authenticateJWT, chargeHoraireRoutes);
app.use('/api/reclamations', authenticateJWT, reclamationRoutes); 
app.use('/api/pwd', passwordRoutes);


// Démarrer le serveur
app.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}`);
});
