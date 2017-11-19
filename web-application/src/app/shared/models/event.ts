export  class Event {

  public id: Number;
  public name: String;
  public _organizerID: Number;
  public type: String;
  public description: String;
  public country: String;
  public city: String;
  public startingTime: Date;
  public maxDuration: Number;
  public enrollmentOpeningAt: Date;
  public enrollmentClosingAt: Date;
  public participantsList: [Number];
  public logo: String;
  public routes: [[String, String]];
}


