export  class Event {

  private id: Number;
  public name: String;
  private _organizerID: Number;
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
  public routes: [String];

  constructor( name: String, organizerId: Number, type: String,
               city: String, country: String, startingTime: Date, maxDuration: Number, openDate: Date,
               closingDate: Date, description: String, participantList: [Number], logo: String, routes: [String]
               ) {
    this.name = name;
    this._organizerID = organizerId;
    this.type = type;
    this.city = city;
    this.country = country;
    this.startingTime = startingTime;
    this.maxDuration = maxDuration;
    this.enrollmentOpeningAt = openDate;
    this.enrollmentClosingAt = closingDate;
    this.description = description;
    this.participantsList = participantList;
    this.logo = logo;
    this.routes = routes;
  }

  get organizerId(){
    return this._organizerID;
  }


}
