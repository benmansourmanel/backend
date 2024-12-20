import Reclamation from '../models/reclamation.js';

// Créer une nouvelle réclamation
export const createReclamation = async (req, res) => {
  try {
    const {
      Annee,
      etudiantId,
      nomPrenom,
      Classe,
      Type_Reclamation,
      enseignant,
      Code_module,
      Module,
      date_reclamation,
      Text_Reclamation
    } = req.body;

    const newReclamation = new Reclamation({
      Annee,
      etudiantId,
      nomPrenom,
      Classe,
      Type_Reclamation,
      enseignant,
      Code_module,
      Module,
      date_reclamation,
      Text_Reclamation,
      Etat: 'Non traité', // Réclamation créée, par défaut non traitée
    });

    await newReclamation.save();
    res.status(201).json({ message: 'Réclamation créée avec succès', reclamation: newReclamation });
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de la création de la réclamation', error });
  }
};

// Obtenir toutes les réclamations d'un enseignant
export const getReclamationsByEnseignant = async (req, res) => {
  try {
    const enseignantId = req.user.id;  // Ensure this is correct
    console.log("Enseignant ID:", enseignantId);  // Log the enseignant ID

    const reclamations = await Reclamation.find({ enseignant: enseignantId })
      .populate('Classe')
      .populate('Module');

    console.log("Reclamations found:", reclamations);  // Log the reclamations found
    res.status(200).json(reclamations);
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de la récupération des réclamations', error });
  }
};

// Obtenir une réclamation par ID
export const getReclamationById = async (req, res) => {
  try {
    const { id } = req.params;
    const reclamation = await Reclamation.findById(id)
      .populate('Classe')
      .populate('Module')
      .populate('enseignant');

    if (!reclamation) {
      return res.status(404).json({ message: 'Réclamation non trouvée' });
    }

    res.status(200).json(reclamation);
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de la récupération de la réclamation', error });
  }
};

// Répondre à une réclamation
export const repondreReclamation = async (req, res) => {
  try {
    const { id } = req.params;
    const { Reponse_Reclamation } = req.body;

    const reclamation = await Reclamation.findById(id);
    if (!reclamation) {
      return res.status(404).json({ message: 'Réclamation non trouvée' });
    }

    reclamation.Reponse_Reclamation = Reponse_Reclamation;
    reclamation.Etat = 'Traité';  // Mettre à jour l'état à "Traité"

    await reclamation.save();
    res.status(200).json({ message: 'Réclamation traitée avec succès', reclamation });
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors du traitement de la réclamation', error });
  }
};

// Supprimer une réclamation
export const deleteReclamation = async (req, res) => {
  try {
    const { id } = req.params;
    await Reclamation.findByIdAndDelete(id);
    res.status(200).json({ message: 'Réclamation supprimée avec succès' });
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de la suppression de la réclamation', error });
  }
};
