export default async function Products() {
  await new Promise((resolve) => setTimeout(resolve, 1000));
  return <div>Products</div>;
}
