import { UserEntityData } from "@internal/backstage-plugin-role-management-common";

export async function getUsers(dbClient: any): Promise<UserEntityData[]> {
    const result = await dbClient('user-data').select() as UserEntityData[];
    const data = result.map(x => {
      return {usename:x.username, password:x.password, email:x.email}
    });

    return data as UserEntityData[];
}

export async function insertuser(dbClient: any, item: UserEntityData) {
    await dbClient('user-data').insert(item);
}


