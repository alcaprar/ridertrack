export class EventsListQueryParams{

  constructor(
    public page?: number,
    public itemsPerPage?: number,
    public type?: string,
    public city?: string,
    public country?: string,
    public keyword?: string,
    public sort?: string,
    public lengthgte?: number,
    public lengthlte?: number,
    public price?: number
  ){}
}
