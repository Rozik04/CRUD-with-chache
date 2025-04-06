import { SetMetadata } from "@nestjs/common";
import { Role } from "src/enums/role.enum";
export let ROLE = "role"


export const Roles = (roles:Role[]) => SetMetadata(ROLE, roles)