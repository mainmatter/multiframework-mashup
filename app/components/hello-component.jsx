//import '@warp-drive/react/install';
import { ReactiveContext, Request, StoreProvider } from '@warp-drive/react';
import { findRecord } from '@warp-drive/utilities/json-api';

export default function App({ store, firstName, lastName }) {
  return (
    <>
      <StoreProvider store={store}>
        <ReactiveContext>
          <HelloComponent firstName={firstName} lastName={lastName} />
        </ReactiveContext>
      </StoreProvider>
    </>
  );
}

export function HelloComponent({ firstName, lastName }) {
  let fullName = firstName + ' ' + lastName;

  return (
    <>
      [React] Hello {fullName}!<br />
      <Request
        query={findRecord('user', '1')}
        states={{
          loading: ({ state }) => (
            <div>Loading user data... {console.log(state)}</div>
          ),
          content: ({ result }) => (
            <span>
              {console.log(result)}
              Hello {result.data.firstName} {result.data.lastName}
            </span>
          ),
        }}
      />
    </>
  );
}
