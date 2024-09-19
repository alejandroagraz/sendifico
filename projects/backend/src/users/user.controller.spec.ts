import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './users.controller';
import { PageOptionsDto } from '../common/dtos/page-options.dto';
import { Order } from '../common/constants/order.constant';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { APP_GUARD } from '@nestjs/core';
import { UsersService } from './users.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from './entity/user.entity';
import DatabaseModule from '../database/database.module';
import { PageDto } from '../common/dtos/page.dto';
import { UserDto } from './dto/user.dto';
import { UnauthorizedException, HttpStatus, HttpException } from '@nestjs/common';
import { StatusUser } from '../common/constants/status-user.constant';
import { Gender } from '../common/constants/gender.constant';
import { CreateUserInput } from './inputs/create-user.input';
import { UpdateUserInput } from './inputs/update-user.input';
import { faker } from '@faker-js/faker';

describe('UsersController', () => {
  let usersController: UsersController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      imports: [
        DatabaseModule,
        TypeOrmModule.forFeature([UserEntity]),
        ThrottlerModule.forRoot([{
          ttl: 60,
          limit: 10,
        }]),
      ],
      providers: [
        UsersService,
        {
          provide: APP_GUARD,
          useClass: ThrottlerGuard,
        },
      ],
    }).compile();

    usersController = app.get<UsersController>(UsersController);
  });

  describe('Get all users', () => {
    it('should Get all users and paginations parameters', async () => {
      const query = new PageOptionsDto();
      query.page = 1;
      query.take = 10;
      query.order = Order.ASC;

      const result = await usersController.getAll(query);

      expect(result).toBeInstanceOf(PageDto<UserDto>);
    });

    it('should throw a 401 Unauthorized', async () => {
      const customMessage = { message: "Unauthorized", statusCode: 401 };
      const query = new PageOptionsDto();
      query.page = 1;
      query.take = 10;
      query.order = Order.ASC;

      try {
        jest.spyOn(usersController, 'getAll').mockImplementation(() => {
          throw new UnauthorizedException(customMessage);
        });

      } catch (err) {
        await expect(usersController.getAll(query)).rejects.toThrow(UnauthorizedException);
        await expect(usersController.getAll(query)).rejects.toThrow(expect.objectContaining({
          message: customMessage.message,
          statusCode: customMessage.statusCode,
        }));
      }
    });
  });

  describe('Get a user according to its ID', () => {
    it('should return an user by id', async () => {
      const query = new PageOptionsDto();
      query.page = 1;
      query.take = 10;
      query.order = Order.ASC;

      const users = await usersController.getAll(query);
      const result = await usersController.getDetail(users.data[0].id);

      expect(result).toBeInstanceOf(UserEntity);
      expect(result).toEqual(users.data[0]);
    });

    it('should return undefined if the user does not exist', async () => {
      const customMessage = { message: "User not found", statusCode: HttpStatus.NOT_FOUND };

      await expect(usersController.getDetail('e62bfc25-3e2e-4fe4-8d23-3b5b3cd0f610')).rejects.toThrow(HttpException);
      await expect(usersController.getDetail('e62bfc25-3e2e-4fe4-8d23-3b5b3cd0f610')).rejects.toThrow(expect.objectContaining({
        response: customMessage.message,
        status: customMessage.statusCode,
      }));
    });

    it('should throw a 401 Unauthorized', async () => {
      const customMessage = { message: "Unauthorized", statusCode: 401 };

      try {
        jest.spyOn(usersController, 'getDetail').mockImplementation(() => {
          throw new UnauthorizedException(customMessage);
        });

      } catch (err) {
        await expect(usersController.getDetail('e62bfc25-3e2e-4fe4-8d23-3b5b3cd0f610')).rejects.toThrow(UnauthorizedException);
        await expect(usersController.getDetail('e62bfc25-3e2e-4fe4-8d23-3b5b3cd0f610')).rejects.toThrow(expect.objectContaining({
          message: customMessage.message,
          statusCode: customMessage.statusCode,
        }));
      }
    });
  });

  describe('Create new user', () => {
    it('should create an task', async () => {
      const newUser = new CreateUserInput();
      newUser.name = 'Leonel';
      newUser.lastname = 'Messi';
      newUser.dni = 12345678;
      newUser.username = 'goat10';
      newUser.gender = Gender.MAN;
      newUser.status = StatusUser.INACTIVE;
      newUser.phone = '123 1234567';
      newUser.address = 'Cra. 87 #30-65, Medellín, Antioquia, Colombia';
      newUser.email = faker.internet.email();
      newUser.password = 'Passw*123';

      const result = await usersController.create(newUser);
      expect(result).toBeInstanceOf(UserEntity);
      await usersController.deleteOneByID(result.id);
    });

    it('should throw a 401 Unauthorized', async () => {
      const customMessage = { message: "Unauthorized", statusCode: 401 };
      const user = new CreateUserInput();
      user.name = 'Leonel';
      user.lastname = 'Messi';
      user.dni = 12345678;
      user.username = 'goat10';
      user.gender = Gender.MAN;
      user.status = StatusUser.INACTIVE;
      user.phone = '123 1234567';
      user.address = 'Cra. 87 #30-65, Medellín, Antioquia, Colombia';
      user.email = faker.internet.email();
      user.password = 'Passw*123';

      try {
        jest.spyOn(usersController, 'create').mockImplementation(() => {
          throw new UnauthorizedException(customMessage);
        });

      } catch (err) {
        await expect(usersController.create(user)).rejects.toThrow(UnauthorizedException);
        await expect(usersController.create(user)).rejects.toThrow(expect.objectContaining({
          message: customMessage.message,
          statusCode: customMessage.statusCode,
        }));
      }
    });
  });

  describe('Update a user according to its ID', () => {
    it('should update an user', async () => {
      const createUser = new CreateUserInput();
      createUser.name = 'Neymar';
      createUser.lastname = 'Junior';
      createUser.dni = 12345678;
      createUser.username = 'ney10';
      createUser.gender = Gender.MAN;
      createUser.status = StatusUser.INACTIVE;
      createUser.phone = '123 1234567';
      createUser.address = 'Cra. 87 #30-65, Medellín, Antioquia, Colombia';
      createUser.email = faker.internet.email();
      createUser.password = 'Passw*123';
      const user = await usersController.create(createUser);

      user.dni = 11223344;
      user.status = StatusUser.ACTIVE;

      const result = await usersController.update(user.id, user);
      expect(result).toBeInstanceOf(UserEntity);
      await usersController.deleteOneByID(result.id);
    });

    it('should return undefined if the user does not exist', async () => {
      const customMessage = { message: "User not found", statusCode: HttpStatus.NOT_FOUND };
      const updateUser = new UpdateUserInput();
      updateUser.dni = 11223344;
      updateUser.status = StatusUser.ACTIVE;

        await expect(usersController.update('e62bfc25-3e2e-4fe4-8d23-3b5b3cd0f610', updateUser)).rejects.toThrow(HttpException);
        await expect(usersController.update('e62bfc25-3e2e-4fe4-8d23-3b5b3cd0f610', updateUser)).rejects.toThrow(expect.objectContaining({
          response: customMessage.message,
          status: customMessage.statusCode,
        }));
    });

    it('should throw a 401 Unauthorized', async () => {
      const customMessage = { message: "Unauthorized", statusCode: 401 };
      const updateUser = new UpdateUserInput();
      updateUser.dni = 11223344;
      updateUser.status = StatusUser.ACTIVE;

      try {
        jest.spyOn(usersController, 'update').mockImplementation(() => {
          throw new UnauthorizedException(customMessage);
        });

      } catch (err) {
        await expect(usersController.update('e62bfc25-3e2e-4fe4-8d23-3b5b3cd0f610', updateUser)).rejects.toThrow(UnauthorizedException);
        await expect(usersController.update('e62bfc25-3e2e-4fe4-8d23-3b5b3cd0f610', updateUser)).rejects.toThrow(expect.objectContaining({
          message: customMessage.message,
          statusCode: customMessage.statusCode,
        }));
      }
    });
  });

  describe('Delete a user according to its ID', () => {
    it('should update an user', async () => {
      const customMessage = { status: 200, message: 'Success remove user' }
      const create = new CreateUserInput();

      create.name = 'Cristiano';
      create.lastname = 'Ronaldo';
      create.dni = 12345678;
      create.username = 'cr7';
      create.gender = Gender.MAN;
      create.status = StatusUser.INACTIVE;
      create.phone = '123 1234567';
      create.address = 'Cra. 87 #30-65, Medellín, Antioquia, Colombia';
      create.email = faker.internet.email();
      create.password = 'Passw*123';

      const user = await usersController.create(create);
      const result = await usersController.deleteOneByID(user.id);

      expect(result).toEqual(customMessage);
    });

    it('should return undefined if the user does not exist', async () => {
      const customMessage = { message: "User not found", statusCode: HttpStatus.NOT_FOUND };

      await expect(usersController.deleteOneByID('e62bfc25-3e2e-4fe4-8d23-3b5b3cd0f610')).rejects.toThrow(HttpException);
      await expect(usersController.deleteOneByID('e62bfc25-3e2e-4fe4-8d23-3b5b3cd0f610')).rejects.toThrow(expect.objectContaining({
        response: customMessage.message,
        status: customMessage.statusCode,
      }));
    });

    it('should throw a 401 Unauthorized', async () => {
      const customMessage = { message: "Unauthorized", statusCode: 401 };
      try {
        jest.spyOn(usersController, 'deleteOneByID').mockImplementation(() => {
          throw new UnauthorizedException(customMessage);
        });

      } catch (err) {
        await expect(usersController.deleteOneByID('e62bfc25-3e2e-4fe4-8d23-3b5b3cd0f610')).rejects.toThrow(UnauthorizedException);
        await expect(usersController.deleteOneByID('e62bfc25-3e2e-4fe4-8d23-3b5b3cd0f610')).rejects.toThrow(expect.objectContaining({
          message: customMessage.message,
          statusCode: customMessage.statusCode,
        }));
      }
    });
  });
});
