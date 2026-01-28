function Renderlist({ products }) {
  return (
    <>
      <h1>Product List</h1>

      {products.map((product) => (
        <>
          <p>Product ID: {product.id}</p>
          <h2>{product.name}</h2>
          <p>Price: {product.price}</p>
          <p>Category: {product.category}</p>
          <hr />
        </>
      ))}
    </>
  );
}

export default Renderlist;
