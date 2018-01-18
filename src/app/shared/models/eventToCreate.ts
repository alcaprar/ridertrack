export class EventToCreate{

  constructor(
    public name?: string,
    public type?: string,
    public startingDateString?: string,
    public startingTimeString?: string,
    public country?: string,
    public city?: string,
    public logo?: File
  ){}
}
