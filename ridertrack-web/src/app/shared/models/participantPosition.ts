export class ParticipantPosition{

  constructor(
    public userId: string,
    public eventId: string,
    public lastPosition: Object
  ){}
}
