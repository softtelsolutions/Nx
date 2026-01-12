import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import {Role} from "../models/roles.entity";
import {Permission} from "../models/permissions.entity";
import {DEFAULT_ROLES_WITH_PERMISSIONS} from "../constant/role_with_permissions.constant";

@Injectable()
export class RolePermissionSeederService {
  constructor(
    @InjectRepository(Role)
    private readonly roleRepository: Repository<Role>,

    @InjectRepository(Permission)
    private readonly permissionRepository: Repository<Permission>,
  ) {}

  async seedRolesAndPermissions() {
    for (const roleData of DEFAULT_ROLES_WITH_PERMISSIONS) {
      // Create or find permissions
      const permissions = [];
      for (const permissionName of roleData.permissions) {
        let permission = await this.permissionRepository.findOne({ where: { name: permissionName } });
        if (!permission) {
          permission = this.permissionRepository.create({ name: permissionName });
          permission = await this.permissionRepository.save(permission);
        }
        permissions.push(permission);
      }

      // Create or find roles
      let role = await this.roleRepository.findOne({
        where: { name: roleData.name },
        relations: ['permissions'],
      });
      if (!role) {
        role = this.roleRepository.create({ name: roleData.name, permissions });
        await this.roleRepository.save(role);
      } else {
        role.permissions = permissions; // Update permissions if needed
        await this.roleRepository.save(role);
      }
    }
  }
}
