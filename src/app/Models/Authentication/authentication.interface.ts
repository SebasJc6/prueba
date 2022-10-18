export interface loginI{
    email: string;
    pwd: string;
}

export interface tokenI{
    tokenType:string;
    accessToken:string;
    refreshToken:string;
    exp:number;
    nbf:number;
    expRt:number;
    accessTokenExpiresIn:number;
    refreshTokenExpiresIn:number;
    userId:string;
}