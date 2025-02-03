import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { AuthService } from './auth.service';
import { User } from './user.entity';
import { NotFoundException } from '@nestjs/common';

describe('UsersController', () => {
  let controller: UsersController;
  let fakeUsersService: Partial<UsersService>;
  let fakeAuthService: Partial<AuthService>;

  beforeEach(async () => {
    fakeUsersService = {
      findOne: (id: number) => {
        return Promise.resolve({
          id,
          email: 'email@gmail.com',
          password: 'asdf',
        } as User);
      },
      find: (email: string) => {
        return Promise.resolve([
          {
            id: 1,
            email,
            password: 'asdf',
          } as User,
        ]);
      },
      remove: (id: number) => {
        return Promise.resolve({
          id,
          email: 'email@gmail.com',
          password: 'asdf',
        } as User);
      },
      update: (id: number, attrs: Partial<User>) => {
        return Promise.resolve({
          id,
          email: 'email@gmail.com',
          password: 'asdf',
        } as User);
      },
    };

    fakeAuthService = {
      // singUp: () => {},
      signIn: (email: string, password: string) => {
        return Promise.resolve({
          id: 1,
          email,
          password,
        } as User);
      },
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        {
          provide: UsersService,
          useValue: fakeUsersService,
        },
        {
          provide: AuthService,
          useValue: fakeAuthService,
        },
      ],
    }).compile();

    controller = module.get<UsersController>(UsersController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('findAllUsers returns a list of users with the given email', async () => {
    const email = 'asd@gmail.com';
    const users = await controller.findAllUsers(email);

    expect(users.length).toEqual(1);
    expect(users[0].email).toEqual(email);
  });

  it('findUser returns the user with the given id', async () => {
    const user = await controller.findUser('1');

    expect(user).toBeDefined();
  });

  it('findUser throws error if the user with the given id is not found', async () => {
    fakeUsersService.findOne = () => null;

    await expect(controller.findUser('1')).rejects.toThrow(NotFoundException);
  });

  it('signIn updates session object and return user', async () => {
    const session = { userId: -10 };
    const user = await controller.signIn(
      {
        email: 'asdf@asdf.com',
        password: 'asd',
      },
      session,
    );

    expect(user.id).toEqual(1);
    expect(session.userId).toEqual(user.id);
  });
});
