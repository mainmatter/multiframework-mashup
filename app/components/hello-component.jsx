export default function HelloComponent({ firstName, lastName }) {
  let fullName = firstName + ' ' + lastName;

  return (
    <>
      [React] Hello {fullName}!
    </>
  );
}
