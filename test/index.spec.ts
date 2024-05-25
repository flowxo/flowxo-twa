import { FlowXOClient } from '../src';

describe('client', () => {
  describe('FxoClient', () => {
    beforeEach(() => {
      Object.defineProperty(window, 'location', {
        value: new URL('http://example.com?this=that&that=this'),
        configurable: true,
      });
    });
    it('should be able to be instantiated', () => {
      const client = new FlowXOClient();
      expect(client).toBeInstanceOf(FlowXOClient);
    });
    it('should take params from window.location.search', () => {
      const params = { this: 'that', that: 'this' };
      const client = new FlowXOClient();
      expect(client.params).toEqual(params);
    });
    it('should store provided params and merge with window params', () => {
      const params = { foo: 'bar', this: 'that', that: 'this' };
      const client = new FlowXOClient({ params });
      expect(client.params).toEqual(params);
    });
    it('should set a default baseUrl', () => {
      const client = new FlowXOClient();
      expect(client.baseUrl).toBe('https://flowxo.com/telegram');
    });
    it('should allow a baseUrl to be set', () => {
      const baseUrl = 'https://example.com';
      const client = new FlowXOClient({ baseUrl });
      expect(client.baseUrl).toBe(baseUrl);
    });
  });
});
