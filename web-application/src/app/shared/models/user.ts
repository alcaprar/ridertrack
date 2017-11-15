export class User{
  private _email: String;
  private _password: String;
  private _name: String;
  private _surname: String;


  constructor(email:String, password:String, name:String, surname:String) {
    this._email = email;
    this._password = password;
    this._name = name;
    this._surname = surname;
  }


  get email():String{
    return this._email;
  }

  set email(value:String){
    this._email=value;
  }

  get password():String{
    return this._password;
  }

  set password(value:String){
    this._password=value;
  }

  get name():String{
    return this._name;
  }

  set name(value:String){
    this._name=value;
  }

  get surname():String{
    return this._surname;
  }

  set surname(value:String){
    this._surname=value;
  }
}


