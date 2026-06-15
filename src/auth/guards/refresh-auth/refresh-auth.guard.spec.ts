import { RefreshJwtAuthGuard } from './refresh-auth.guard';

describe('RefreshAuthGuard', () => {
  it('should be defined', () => {
    expect(new RefreshJwtAuthGuard()).toBeDefined();
  });
});
