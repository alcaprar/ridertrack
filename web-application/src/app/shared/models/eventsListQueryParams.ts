export class EventsListQueryParams{

  constructor(
    public page?: number,
    public itemsPerPage?: number,
    public type?: string,
    public city?: string,
    public country?: string,
    public keyword?: string,
    public sort?: string,
    public length?: number,
    public price?: number
  ){}
}
