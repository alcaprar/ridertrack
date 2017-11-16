export  class Event {
  id: Number;
  name: String;
  organizerID: Number;
  type: String;
  description: String;
  country: String;
  city: String;
  startingTime: Date;
  maxDuration: Number;
  enrollmentOpeningAt: Date;
  enrollmentClosingAt: Date;
  participantsList: [Number];
  logo: String;
  routes: String;
}
