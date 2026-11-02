import AsyncStorage from '@react-native-async-storage/async-storage';
import { clear, enqueue, getAll, remove, update } from '../outbox';

describe('outbox queue', () => {
  beforeEach(async () => {
    await AsyncStorage.clear();
    await clear();
  });

  it('starts empty', async () => {
    const list = await getAll();
    expect(list).toEqual([]);
  });

  it('enqueues actions in order', async () => {
    const action1 = await enqueue({
      method: 'PATCH',
      url: '/assignments/1',
      body: { status: 'done' },
    });
    const action2 = await enqueue({
      method: 'POST',
      url: '/assignments',
      body: { title: 'Bài tập 2' },
      localId: 'local-123',
    });

    const list = await getAll();
    expect(list.length).toBe(2);
    expect(list[0].id).toBe(action1.id);
    expect(list[1].id).toBe(action2.id);
    expect(list[1].localId).toBe('local-123');
  });

  it('updates an existing action in outbox', async () => {
    const action = await enqueue({
      method: 'PATCH',
      url: '/assignments/1',
      body: { status: 'todo' },
    });

    await update(action.id, { body: { status: 'done' } });

    const list = await getAll();
    expect(list[0].body.status).toBe('done');
  });

  it('removes action by id', async () => {
    const action1 = await enqueue({ method: 'PATCH', url: '/assignments/1' });
    const action2 = await enqueue({ method: 'PATCH', url: '/assignments/2' });

    await remove(action1.id);

    const list = await getAll();
    expect(list.length).toBe(1);
    expect(list[0].id).toBe(action2.id);
  });
});

