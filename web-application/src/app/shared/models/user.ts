export class User {
 private _email: String;
 private _password: String;
 private _name: String;
 private _surname: String;
 private _id: String;
 private picture: String;


  constructor(email: String, name: String, surname: String, password: String) {
    this._email = email;
    this._name = name;
    this._surname = surname;
    this._password = password;
  }

  set profilePicture(value: String) {
    this.picture = value;
  }

  get profilePicture(){
    return this.picture;
  }

  get password() {
    return this._password;
  }

  set password(value: String) {
    this._password = value;
  }

  get email(): String{
    return this._email;
  }

  set email(value: String){
    this._email = value;
  }

  get name(): String{
    return this._name;
  }

  set name(value: String){
    this._name = value;
  }

  get surname(): String{
    return this._surname;
  }

  set surname(value: String){
    this._surname = value;
  }

  set id(value: String){
    this._id = value;
  }

  get id(){
    return this._id;
  }
}


