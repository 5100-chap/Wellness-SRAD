export class LoginResponse {
    //Parametros
    private _user: any;
    token: string = '';
    //Conseguimos el valor de User
    get user(): any {
        return this._user;
    }
    //Si recibe un array, conviertelo a un solo valor
    set user(value: any) {
        this._user = Array.isArray(value) ? value[0] : value;
    }
}
