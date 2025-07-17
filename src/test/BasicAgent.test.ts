import * as assert from 'assert';
import { BasicAgent } from '../agents/BasicAgent';

describe('BasicAgent', () => {
  it('should instantiate with an API key', () => {
    const agent = new BasicAgent('test-key');
    assert.ok(agent);
  });

  it('should throw an error if the API call fails', async () => {
    // Mock the HfInference class to throw
    const original = (agent: any) => agent.hf.textGeneration;
    const agent = new BasicAgent('test-key');
    (agent as any).hf.textGeneration = async () => { throw new Error('Mock error'); };
    await assert.rejects(() => agent.generateCompletion('test'), /Mock error/);
    // Restore if needed
    (agent as any).hf.textGeneration = original;
  });
}); 