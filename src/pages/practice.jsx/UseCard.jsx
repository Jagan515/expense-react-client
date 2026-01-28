function UseCard({ name, location, isPremium }) {
  return (
    <>
      <h1>Name: {name}</h1>
      <p>Location: {location}</p>

      {isPremium ? (
        <h2>VIP Member</h2>
      ) : (
        <h2>Standard Member</h2>
      )}
    </>
  );
}

export default UseCard;
