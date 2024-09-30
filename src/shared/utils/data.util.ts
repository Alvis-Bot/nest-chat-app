
import { faker } from '@faker-js/faker';
import { User } from '../../module/users/schemas/user.schema';

export const generateUser = (count: number) => {
  const users : User[] = [];
  for (let i = 0; i < count; i++) {
    const user: User = {
      full_name: faker.person.fullName(),
      password: '123456',
      username: faker.internet.userName(),
    };
    users.push(user);
  }
  return users;
};
