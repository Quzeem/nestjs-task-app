import * as bcrypt from 'bcryptjs';
import { User } from './user.entity';

describe('User Entity', () => {
  let user: User;
  let bcryptCompare;

  beforeEach(() => {
    user = new User();
    user.password = 'testPasswordHash';

    bcryptCompare = jest.fn();
    (bcrypt.compare as jest.Mock) = bcryptCompare;
  });

  describe('verifyPassword', () => {
    it('returns true if password is valid', async () => {
      bcryptCompare.mockResolvedValue(true);
      expect(bcrypt.compare).not.toHaveBeenCalled();
      const result = await user.verifyPassword('testPassword');
      expect(bcrypt.compare).toHaveBeenCalled();
      expect(bcrypt.compare).toHaveBeenCalledWith(
        'testPassword',
        'testPasswordHash',
      );
      expect(result).toEqual(true);
    });

    it('returns false if password is invalid', async () => {
      bcryptCompare.mockResolvedValue(false);
      expect(bcrypt.compare).not.toHaveBeenCalled();
      const result = await user.verifyPassword('wrongPassword');
      expect(bcrypt.compare).toHaveBeenCalled();
      expect(bcrypt.compare).toHaveBeenCalledWith(
        'wrongPassword',
        'testPasswordHash',
      );
      expect(result).toEqual(false);
    });
  });
});
