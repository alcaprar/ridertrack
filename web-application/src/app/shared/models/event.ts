export class Event{

  constructor(
    public name?: string,
    public type?: string,
    public startingDate?: string,
    public country?: string,
    public city?: string,
    public logo?: File,
    public length?: number
  ){}
}
