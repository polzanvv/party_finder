import request from 'supertest';
import { expect } from 'chai';
import app from '../app.js';

describe('Venue Routes', () => {
  it('GET /api/venues should return 200 and JSON', async () => {
    const res = await request(app)
      .get('/api/venues')
      .query({ lat: '49.2827', lng: '-123.1207' }); // Пример: координаты Ванкувера

    expect(res.status).to.equal(200);
    expect(res.headers['content-type']).to.match(/json/);
    expect(res.body).to.have.property('googlePlaces');
    expect(res.body.googlePlaces).to.be.an('array');
  });
});
