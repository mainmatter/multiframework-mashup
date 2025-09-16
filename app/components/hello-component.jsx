import { Request, StoreProvider } from '@warp-drive/react';
import { findRecord } from '@warp-drive/utilities/json-api';
import { useSyncExternalStore } from 'react';

export default function HelloComponent({
  store,
  firstName,
  lastName,
  counter,
}) {
  let fullName = firstName + ' ' + lastName;
  let count = useSyncExternalStore(counter.subscribe, () => counter.count);

  return (
    <>
      [React] Hello {fullName}!<br />
      <StoreProvider store={store}>
        <Request
          query={findRecord('user', '1')}
          states={{
            loading: () => <div>Loading user data...</div>,
            content: ({ result }) => (
              <div>
                Hello from React {result.data.firstName} {result.data.lastName}
              </div>
            ),
          }}
        />
      </StoreProvider>
      <div>
        <h3>React Counter</h3>
        <p>
          {count}
          <button type="button" onClick={() => counter.increment()}>
            +1
          </button>
        </p>
      </div>
    </>
  );
}
