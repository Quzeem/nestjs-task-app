import {
  ConflictException,
  InternalServerErrorException,
} from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { UserRepository } from './user.repository';
import * as bcrypt from 'bcryptjs';
import { User } from './user.entity';

const mockCredentialsDto = { username: 'test user', password: 'password' };

describe('UserRepository', () => {
  let userRepository;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [UserRepository],
    }).compile();

    userRepository = moduleRef.get<UserRepository>(UserRepository);
  });

  describe('signUp', () => {
    let save;

    beforeEach(() => {
      save = jest.fn();
      userRepository.create = jest.fn().mockReturnValue({ save });
    });

    it('successfully signs up a user', () => {
      save.mockResolvedValue('some value');
      expect(userRepository.signUp(mockCredentialsDto)).resolves.not.toThrow();
    });

    it('throws a conflict exception as username already exists', () => {
      save.mockRejectedValue({ code: '23505' });
      expect(userRepository.signUp(mockCredentialsDto)).rejects.toThrow(
        ConflictException,
      );
    });

    it('throws an internal server error exception for any unhandled error', () => {
      save.mockRejectedValue({ code: '24326' }); // unhandled error code
      expect(userRepository.signUp(mockCredentialsDto)).rejects.toThrow(
        InternalServerErrorException,
      );
    });
  });

  describe('validateUser', () => {
    let user;

    beforeEach(() => {
      userRepository.findOne = jest.fn();

      user = new User();
      user.username = mockCredentialsDto.username;
      user.verifyPassword = jest.fn();
    });

    it('returns the username as validation is successful', async () => {
      userRepository.findOne.mockResolvedValue(user);
      user.verifyPassword.mockResolvedValue(true);

      expect(userRepository.findOne).not.toHaveBeenCalled();
      expect(user.verifyPassword).not.toHaveBeenCalled();

      const result = await userRepository.validateUser(mockCredentialsDto);

      expect(userRepository.findOne).toHaveBeenCalled();
      expect(user.verifyPassword).toHaveBeenCalled();
      expect(result).not.toBeNull();
      expect(result).toEqual(mockCredentialsDto.username);
    });

    it('returns null as user cannot be found', async () => {
      userRepository.findOne.mockResolvedValue(null);

      expect(userRepository.findOne).not.toHaveBeenCalled();
      expect(user.verifyPassword).not.toHaveBeenCalled();

      const result = await userRepository.validateUser(mockCredentialsDto);

      expect(userRepository.findOne).toHaveBeenCalled();
      expect(user.verifyPassword).not.toHaveBeenCalled();
      expect(result).toBeNull();
    });

    it('returns null as password is invalid', async () => {
      userRepository.findOne.mockResolvedValue(user);
      user.verifyPassword.mockResolvedValue(false);

      expect(userRepository.findOne).not.toHaveBeenCalled();
      expect(user.verifyPassword).not.toHaveBeenCalled();

      const result = await userRepository.validateUser(mockCredentialsDto);

      expect(userRepository.findOne).toHaveBeenCalled();
      expect(user.verifyPassword).toHaveBeenCalled();
      expect(result).toBeNull();
    });
  });

  describe('hashPassword', () => {
    it('calls bcrypt.hash to generate a hash', async () => {
      const bcryptHash = jest.fn().mockResolvedValue('testPasswordHash');
      (bcrypt.hash as jest.Mock) = bcryptHash;

      expect(bcrypt.hash).not.toHaveBeenCalled();

      const result = await userRepository.hashPassword('testPassword');

      expect(bcrypt.hash).toHaveBeenCalled();
      expect(result).toEqual('testPasswordHash');
    });
  });
});
