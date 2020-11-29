import Cache from './cache';

describe('Cache', () => {
  describe('#get', () => {
    it('should return ok false for empty map', () => {
      const cache = new Cache(2);
      const result = cache.get(['name']);
      expect(result.length).toBe(1);
      expect(result[0].ok).toBe(false);
    });

    it('should return ok false for non existent key', () => {
      const cache = new Cache(2);
      cache.set({
        key: 'user-1',
        value: '12345',
      });
      const result = cache.get(['name']);
      expect(result.length).toBe(1);
      expect(result[0].ok).toBe(false);
    });

    it('should return ok true for recently added keys', () => {
      const cache = new Cache(2);
      cache.set({
        key: 'user-1',
        value: '12345',
      });
      cache.set({
        key: 'user-2',
        value: '12345',
      });
      const result = cache.get(['user-2', 'user-1']);
      expect(result.length).toBe(2);
      expect(result[0].ok).toBe(true);
      expect(result[1].ok).toBe(true);
    });
  });

  describe('#delete', () => {
    it('should return ok false for non existent key', () => {
      const cache = new Cache(2);
      cache.set({
        key: 'user-1',
        value: '12345',
      });
      cache.set({
        key: 'user-2',
        value: '12345678',
      });

      const result = cache.delete(['user-1']);
      expect(result.length).toBe(1);
      expect(result[0].ok).toBe(true);
      expect(result[0].key).toBe('user-1');

      const delResult = cache.get(['user-1', 'user-2']);
      expect(delResult.length).toBe(2);

      expect(delResult[0].ok).toBe(false);
      expect(delResult[0].key).toBe('user-1');
      expect(delResult[0].value).not.toBeDefined();

      expect(delResult[1].ok).toBe(true);
      expect(delResult[1].key).toBe('user-2');
      expect(delResult[1].value).toBe('12345678');
    });
  });
});
