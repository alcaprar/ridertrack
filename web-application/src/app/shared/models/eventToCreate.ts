export class EventToCreate{
  
  constructor(
    public name?: string,
    public type?: string,
    public startingDate?: string,
    public country?: string,
    public city?: string,
    public logo?: File
  ){}
}
