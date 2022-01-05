import { JwtStrategy } from './jwt.strategy';
import { Test } from '@nestjs/testing';
import { UserRepository } from './user.repository';
import { User } from './user.entity';
import { UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

const mockUserRepository = () => ({
  findOne: jest.fn(),
});

const mockConfig = () => ({
  get: jest.fn().mockReturnValue('123'),
});

describe('JwtStrategy', () => {
  let jwtStrategy: JwtStrategy;
  let userRepository;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [
        JwtStrategy,
        { provide: ConfigService, useFactory: mockConfig },
        { provide: UserRepository, useFactory: mockUserRepository },
      ],
    }).compile();

    jwtStrategy = moduleRef.get<JwtStrategy>(JwtStrategy);
    userRepository = moduleRef.get<UserRepository>(UserRepository);
  });

  describe('validate', () => {
    it('validates and returns the user based on JWT payload', async () => {
      const user = new User();
      user.username = 'TestUser';

      userRepository.findOne.mockResolvedValue(user);
      const result = await jwtStrategy.validate({ username: 'TestUser' });
      expect(userRepository.findOne).toHaveBeenCalledWith({
        username: 'TestUser',
      });
      expect(result).toEqual(user);
    });

    it('throws an unauthorized exception as user cannot be found', async () => {
      userRepository.findOne.mockResolvedValue(null);
      expect(jwtStrategy.validate({ username: 'TestUser' })).rejects.toThrow(
        UnauthorizedException,
      );
    });
  });
});
