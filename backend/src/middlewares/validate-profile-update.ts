import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import User from '../models/user-model';

export const validateProfileUpdate = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const token = req.header('x-token');
  
  if (!token) {
    res.status(401).json({ message: 'No token provided' });
    return;
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'default_secret') as { userId: number };
    const { userId } = decoded;
    const idToUpdate = req.params.id;

    console.log('🔐 Validación de perfil:');
    console.log('   ID desde token:', userId, '(tipo:', typeof userId, ')');
    console.log('   ID desde URL:', idToUpdate, '(tipo:', typeof idToUpdate, ')');

    // Verificar que el usuario existe
    const user = await User.findByPk(userId);
    if (!user || user.status === 'deleted') {
      res.status(404).json({ message: 'User not found' });
      return;
    }

    console.log('   Rol del usuario:', user.role);
    
    // Convertir ambos IDs a número para comparación consistente
    const userIdNum = Number(userId);
    const idToUpdateNum = Number(idToUpdate);

    console.log('   Comparación:', userIdNum, '===', idToUpdateNum, '→', userIdNum === idToUpdateNum);
    
    // Permitir que usuarios actualicen su propio perfil O admins actualicen cualquier perfil
    if (userIdNum !== idToUpdateNum && user.role !== 'admin') {
      console.log('   ❌ Permiso denegado');
      res.status(403).json({ message: 'You can only update your own profile' });
      return;
    }

    console.log('   ✅ Permiso concedido');
    next();
  } catch (error) {
    console.log('❌ Error en validación de token:', error);
    res.status(401).json({ message: 'Invalid token' });
  }
};