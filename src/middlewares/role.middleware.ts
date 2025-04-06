import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLE} from './type.middleware';


@Injectable()
export class RoleAuthGuard implements CanActivate {

    constructor(private reflector: Reflector) {}

    canActivate(context: ExecutionContext): boolean {
        const requiredRoles  = this.reflector.getAllAndOverride(ROLE,[
            context.getHandler(),
            context.getClass()
        ])
        if(!requiredRoles ){
            return true
        }
       const {user} = context.switchToHttp().getRequest();
       if(!user){
        return false
       }
       return requiredRoles.includes(user.role);
    }

}
