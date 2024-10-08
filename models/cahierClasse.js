import { Schema, model } from 'mongoose';

const cahierClasseSchema = new Schema({
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    date: { type: Date, required: true },
    contenu: { type: String, required: true },
    horaire_seance: { type: String, required: true },
    titre_seance: { type: String, required: true },
    remarque: { type: String, required: true },
    module: { type: Schema.Types.ObjectId, ref: 'Module', required: true },
    classe: { type: Schema.Types.ObjectId, ref: 'Classe', required: true }, // Ajoutez ce champ
    semestre: { type: String }  
}, {
    timestamps: true
});

export default model('CahierClasse', cahierClasseSchema);
