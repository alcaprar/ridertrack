export class User {
 private _id: String;
 public logo: File;
 public city: string;
 public aboutMe: string;
 public role: string;


  constructor(
    public email?: String,
    public name?: String,
    public surname?: String,
    public password?: String
  ) {}

  set id(value: String){
    this._id = value;
  }

  get id(){
    return this._id;
  }

}


