export class User {
 private _id: String;
 private picture: String;
 public city: string;
 public aboutMe: string;
 public image: File;
 public role: string;


  constructor(
    public email?: String,
    public name?: String,
    public surname?: String,
    public password?: String
  ) {}

  set profilePicture(value: String) {
    this.picture = value;
  }

  get profilePicture(){
    return this.picture;
  }

  set id(value: String){
    this._id = value;
  }

  get id(){
    return this._id;
  }

}


