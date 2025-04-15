import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const clienteSchema = new mongoose.Schema({
  nombre: { type: String, required: true },
  email: { 
    type: String, 
    required: true,
    unique: true,
    match: [/^[^\s@]+@[^\s@]+\.[^\s@]+$/, 'Formato de email inválido']
  },
  password: { type: String, required: true },
  telefono: { 
    type: String,
    required: true,
    match: [/^[0-9]{10}$/, 'El teléfono debe tener 10 dígitos']
  },
  empresa: { type: String, required: true },
  rfc: {
    type: String,
    required: true,
    unique: true,
    uppercase: true,
    match: [/^[A-Z&Ñ]{3,4}\d{6}[A-V1-9][A-Z1-9][0-9A]$/, 'Formato de RFC inválido']
  },
  fechaRegistro: { type: Date, default: Date.now },
  activo: { type: Boolean, default: true }
});

clienteSchema.pre('save', async function(next) {
  if (this.isModified('password')) {
    this.password = await bcrypt.hash(this.password, 10);
  }
  next();
});

export default mongoose.model('Cliente', clienteSchema);