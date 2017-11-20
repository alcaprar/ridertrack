import { TestBed, inject, fakeAsync} from '@angular/core/testing';
import {
  RequestOptions, BaseRequestOptions, Http, Response, HttpModule, ResponseOptions,
  RequestMethod
} from '@angular/http';
import {MockBackend, MockConnection} from '@angular/http/testing';


import { EventService } from './event.service';
import { Event} from '../models/event';


describe('EventService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpModule],
      providers: [
        EventService,
        MockBackend,
        BaseRequestOptions,
        {
         provide: Http,
          useFactory: (backend: MockBackend, options: RequestOptions) => {
            return new Http(backend, options);
          },
          deps: [MockBackend, BaseRequestOptions]
        }]
    });
  });

  // Mock event example
  const event : Event = {id: 1, name: 'London Marathon', _organizerID: 2, type: 'Marathon', description: 'Bla bla bla bla',
    country: 'UK', city: 'London', startingTime: new Date('21 december, 2017 10:00:00'), maxDuration: 120,
    participantsList: null, enrollmentOpeningAt:  new Date('1 december, 2017 10:00:00'),
    enrollmentClosingAt:  new Date('15 december, 2017 10:00:00'),
    logo: 'http:bla.bla.com', routes: [[0,0]], length: 120};

  it('should be created', inject([EventService], (service: EventService) => {
    expect(service).toBeTruthy();
  }));

  it('should get event details', fakeAsync(inject(
    [EventService, MockBackend], (service, mockBackend) => {

    mockBackend.connection.subscribe((connection: MockConnection) => {
      expect(connection.request.url).toEqual('http://localhost:5000/api/events/1');
      expect(connection.request.method).toEqual(RequestMethod.Get);
      const options = new ResponseOptions({body: event});
      connection.mockRespond(new Response(options));
    });

    service.getEvent(1).then((response) => {
      expect(response).toEqual(event);
    });
  })));

  it('should create an event', fakeAsync(inject(
    [EventService, MockBackend], (service, mockBackend) => {

     mockBackend.connection.subscribe((connection: MockConnection) => {
        expect(connection.request.url).toEqual('http://localhost:5000/api/events');
        expect(connection.request.method).toEqual(RequestMethod.Post);
        expect(connection.request.getBody().toEqual(JSON.stringify(event)));

        const options = new ResponseOptions({body: event});
        connection.mockRespond(new Response(options));
      });

      service.createEvent(event).then((response) => {
        expect(response).toEqual(event);
      });
    })));
});


