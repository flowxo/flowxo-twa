import { FlowXOClient } from '../src';

describe('client', () => {
  describe('FxoClient', () => {
    it('should be able to be instantiated', () => {
      const client = new FlowXOClient();
      expect(client).toBeInstanceOf(FlowXOClient);
    });
  });
});
