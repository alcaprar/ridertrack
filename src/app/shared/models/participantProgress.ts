export class ParticipantProgress{

  constructor(
    public userId: string,
    public eventId: string,
    public lastPosition: Object
  ){}
}
