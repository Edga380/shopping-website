"use server";

export async function addProduct(formData: FormData) {
  console.log(formData);

  const { name, description, priceInCents, units, image, available } =
    Object.fromEntries(formData.entries());

  console.log(name);
  console.log(description);
  console.log(priceInCents);
  console.log(units);
  console.log(image);
  console.log(available);
}
