import { CanActivate, ExecutionContext, Injectable } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { JwtService } from "@nestjs/jwt";

@Injectable()
export class JwtAuthGuard implements CanActivate{
    constructor( private jwt : JwtService, private reflector:Reflector){}
    canActivate(context: ExecutionContext): boolean {
        const request = context.switchToHttp().getRequest();
        const Header = request.headers.authorization;

        if(!Header){
            return false;
        }

        const token = Header.split(' ')[1]
        try {
            const data = this.jwt.verify(token)
            request['user'] = data;
            return true
        } catch (error) {
            console.log({error:error.message});
            
            return false
        }
    }         
}