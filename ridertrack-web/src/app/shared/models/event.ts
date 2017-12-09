export class Event{

  constructor(
    public _id?: string,
    public name?: string,
    public type?: string,
    public description?:string,
    public startingDate?: string,
    public startingTime?: string,
    public country?: string,
    public city?: string,
    public logo?: File,
    public status?: string,
    public maxDuration?: number,
    public length?: number,
    public routes?: [{lat: number, lng: number}],
    public enrollmentClosingAt?: Date,
    public enrollmentOpeningAt?: Date,
    //public ranking?: File
  ){}
}
