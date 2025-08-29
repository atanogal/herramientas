import request from 'supertest';
import app from '../app.js'; // Asegúrate que exportas el app desde app.js sin hacer app.listen ahí

describe('GET /', () => {
  it('debe responder con el texto correcto y status 200', async () => {
    const res = await request(app).get('/');
    expect(res.statusCode).toBe(200);
    expect(res.text).toBe('Servidor funcionando');
  });
});