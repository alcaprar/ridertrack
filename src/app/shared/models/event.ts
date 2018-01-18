export class Event{

  constructor(
    public _id?: string,
    public name?: string,
    public type?: string,
    public description?:string,
    public startingDate?: Date,
    public startingDateString?: string,
    public startingTimeString?: string,
    public closingDate?: Date,
    public closingDateString?: string,
    public closingTimeString?: string,
    public country?: string,
    public city?: string,
    public logo?: File,
    public status?: string,
    public maxDuration?: number,
    public maxParticipants?: number,
    public length?: number,
    public routes?: [{lat: number, lng: number}],
    public enrollmentClosingDate?: Date,
    public enrollmentClosingDateString?: string,
    public enrollmentClosingTimeString?: string,
    public enrollmentOpeningDate?: Date,
    public enrollmentOpeningDateString?: string,
    public enrollmentOpeningTimeString?: string
  ){}
}
