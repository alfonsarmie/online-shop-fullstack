import request from 'supertest';


// Evita cargar el paquete ESM real de uuid
jest.mock('uuid', () => ({ v4: () => 'test-uuid' }), { virtual: true });


import app from '../../src/app'
import { connectDB, db } from '../../src/db/connection'; 
import User from '../../src/models/user-model';
import bcrypt from 'bcryptjs';

// Conectarse a la base de datos antes de que se ejecuten todas las pruebas
beforeAll(async () => {
  await connectDB();
});

// Limpiar la base de datos antes de cada prueba
beforeEach(async () => {
  await User.destroy({ where: {} });
});

// Desconectarse de la base de datos después de que se completen todas las pruebas
afterAll(async () => {
  await db.close();
});

describe('POST /api/auth/login', () => {

  it('debería autenticar a un usuario con credenciales válidas y devolver un token', async () => {
    // 1. Preparación: Crear un usuario de prueba en la base de datos
    const hashedPassword = await bcrypt.hash('password123', 10);
    await User.create({
      name: 'Test',
      surname: 'User',
      email: 'test@example.com',
      password: hashedPassword,
      status: 'active',
      isMember: false,
      registrationDate: new Date()
    });

    // 2. Ejecución: Enviar una petición POST al endpoint de login
    const response = await request(app)
      .post('/api/auth/login')
      .send({
        email: 'test@example.com',
        password: 'password123'
      });

    // 3. Afirmación: Verificar que la respuesta es la esperada
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('token');
    expect(response.body.userFound.email).toBe('test@example.com');
  });

  it('debería devolver un error 400 si la contraseña es incorrecta', async () => {
    const hashedPassword = await bcrypt.hash('password123', 10);
    await User.create({
      name: 'Test',
      surname: 'User',
      email: 'test@example.com',
      password: hashedPassword,
      status: 'active',
      isMember: false, 
      registrationDate: new Date()
    });

    const response = await request(app)
      .post('/api/auth/login')
      .send({
        email: 'test@example.com',
        password: 'wrongpassword'
      });

    expect(response.status).toBe(400);
    expect(response.body.message).toBe('La contraseña es incorrecta');
  });

  it('debería devolver un error 400 si el usuario no existe', async () => {
    const response = await request(app)
      .post('/api/auth/login')
      .send({
        email: 'nonexistent@example.com',
        password: 'somepassword'
      });

    expect(response.status).toBe(400);
    expect(response.body.message).toBe('No existe una cuenta con este correo electrónico');
  });

  it('debería devolver un error 400 si la cuenta del usuario no está activa', async () => {
    const hashedPassword = await bcrypt.hash('password123', 10);
    await User.create({
      name: 'Inactive',
      surname: 'User',
      email: 'inactive@example.com',
      password: hashedPassword,
      status: 'inactive',
      isMember: false, 
      registrationDate: new Date()
    });

    const response = await request(app)
      .post('/api/auth/login')
      .send({
        email: 'inactive@example.com',
        password: 'password123'
      });

    expect(response.status).toBe(400);
    expect(response.body.message).toBe('Tu cuenta no está activada. Revisa tu correo para activarla');
  });
});