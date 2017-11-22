export class Event{

  constructor(
    public _id?: string,
    public name?: string,
    public type?: string,
    public startingDate?: string,
    public country?: string,
    public city?: string,
    public logo?: File,
    public length?: number,
    public routes?: [number, number],
    public enrollmentClosingAt?: Date,
    public enrollmentOpeningAt?: Date
  ){}
}
