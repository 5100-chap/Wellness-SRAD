export class LoginResponse {
    token: string = "";
    user: any;

    constructor(token: string, user: any[]) {
        this.token = token;
        this.user = user.length > 0 ? user[0] : null;
    }
}