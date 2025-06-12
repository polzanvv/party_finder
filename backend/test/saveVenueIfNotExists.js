import { expect } from 'chai';
import sinon from 'sinon';
import { saveVenueIfNotExists } from '../controllers/venueController.js';
import Venue from '../models/venue.js';

describe('saveVenueIfNotExists controller', () => {
  let req, res, statusStub, jsonStub;

  beforeEach(() => {
    req = {
      body: {
        googlePlaceId: 'abc123',
        name: 'Test Venue',
        location: '123 Test St',
        imageUrl: 'http://image.url/test.jpg'
      }
    };

    jsonStub = sinon.stub();
    statusStub = sinon.stub().returns({ json: jsonStub });
    res = { status: statusStub };
  });

  afterEach(() => {
    sinon.restore();
  });

  it('should return 400 if required fields missing', async () => {
    req.body = {};

    await saveVenueIfNotExists(req, res);

    expect(statusStub.calledWith(400)).to.be.true;
    expect(jsonStub.calledWithMatch({ message: 'Missing required fields' })).to.be.true;
  });

  it('should create new venue if not exists', async () => {
    sinon.stub(Venue, 'findOne').resolves(null);
    const createdVenue = { _id: '1', ...req.body };
    sinon.stub(Venue, 'create').resolves(createdVenue);

    await saveVenueIfNotExists(req, res);

    expect(statusStub.calledWith(201)).to.be.true;
    expect(jsonStub.calledWithMatch({ venue: createdVenue })).to.be.true;
  });

  it('should return existing venue if already exists', async () => {
    const existingVenue = { _id: '1', ...req.body };
    sinon.stub(Venue, 'findOne').resolves(existingVenue);

    await saveVenueIfNotExists(req, res);

    expect(statusStub.calledWith(200)).to.be.true;
    expect(jsonStub.calledWithMatch({ venue: existingVenue })).to.be.true;
  });
});