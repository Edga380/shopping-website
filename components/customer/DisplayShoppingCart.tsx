"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";
import getCartData from "../../database/models/product/getCartData";
import { Cart, UpdatedProduct, UserData } from "../../types/databaseTypes";
import getProduct from "../../database/models/product/getProduct";
import deleteCartItem from "../../database/models/product/deleteCartItem";
import { formatCurrency } from "../../utils/formatters";
import { useRouter } from "next/navigation";
import updateCartItemQuantity from "../../database/models/product/updateCartItemQuantity";

export default function DisplayShoppingCart({ user }: { user: UserData }) {
  const [cartData, setCartData] = useState<Cart[]>([]);
  const [productData, setProductData] = useState<UpdatedProduct[]>([]);
  const router = useRouter();

  useEffect(() => {
    const fetchCartData = async () => {
      const cartData = await getCartData(user.user_id);
      if (cartData) {
        setCartData(cartData);
        cartData.forEach(async (cart) => {
          const fetchProductData = await getProduct(String(cart.product_id));
          setProductData((prev) => [...prev, fetchProductData]);
        });
      }
    };
    fetchCartData();
  }, [user]);

  const handleDeleteCartItem = async (cartId: number, userId: number) => {
    try {
      await deleteCartItem(cartId, userId);
      router.refresh();
    } catch (error) {
      throw error;
    }
  };

  const handleSetSelectedQuantity = async (
    sign: string,
    quantity: number,
    cartId: number,
    userId: number,
    productId: number
  ) => {
    if (sign === "minus") {
      const updatedQuantity = quantity - 1;
      if (updatedQuantity < 1) return;
      try {
        await updateCartItemQuantity(
          updatedQuantity,
          cartId,
          userId,
          productId
        );
        router.refresh();
      } catch (error) {
        throw error;
      }
    } else if (sign === "plus") {
      const updatedQuantity = quantity + 1;
      if (updatedQuantity > 10) return;
      try {
        await updateCartItemQuantity(
          updatedQuantity,
          cartId,
          userId,
          productId
        );
        router.refresh();
      } catch (error) {
        throw error;
      }
    }
  };

  return (
    <div className="flex-col w-full">
      <div className="bg-color-pallet-03 text-text-color-dark-green text-2xl text-center font-semibold p-2 rounded-t-2xl">
        Shopping Cart
      </div>
      {cartData.length === 0 ? (
        <div className="bg-color-pallet-02 text-text-color-dark-green shadow-md pb-6 text-2xl font-semibold text-center m-6">
          Your shopping cart is empty...
          <Link
            href={"/products"}
            className="bg-color-pallet-03 text-lg font-semibold text-text-color-dark-green px-3 py-3 rounded shadow-md m-2 hover:bg-color-pallet-04"
          >
            Shop now
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-[2fr_1fr]">
          <div>
            {productData.length > 0 &&
              cartData.map((cart) => (
                <div
                  key={cart.cart_id}
                  className="bg-color-pallet-02 shadow-md pb-6 mx-2 text-2xl text-center m-2"
                >
                  <div className="bg-color-pallet-03 p-2 font-semibold text-text-color-dark-green">
                    {
                      productData.find(
                        (product) => product.product_id === cart.product_id
                      )?.name
                    }
                  </div>
                  <div className="grid grid-cols-[1fr_1fr_1fr_1fr_1fr_1fr]">
                    <div className="mx-auto my-4">
                      <Image
                        src={
                          productData
                            .find((product) =>
                              product.product_variations.some(
                                (product_variation) =>
                                  product_variation.product_variation_id ===
                                  cart.product_variation_id
                              )
                            )
                            ?.product_variations.find(
                              (product_variation) =>
                                product_variation.product_variation_id ===
                                cart.product_variation_id
                            )?.images[0] || "/products/product_not_found.svg"
                        }
                        width={100}
                        height={100}
                        alt="product"
                        className="shadow-md"
                      />
                    </div>
                    <div className="p-2 font-semibold text-text-color-dark-green m-auto text-xl">
                      <div>Size: {cart.product_size}</div>
                      <div>
                        Color:{" "}
                        {
                          productData
                            .find((product) =>
                              product.product_variations.some(
                                (product_variation) =>
                                  product_variation.product_variation_id ===
                                  cart.product_variation_id
                              )
                            )
                            ?.product_variations.find(
                              (product_variation) =>
                                product_variation.product_variation_id ===
                                cart.product_variation_id
                            )?.color
                        }
                      </div>
                    </div>
                    <button
                      className="bg-red-500 text-sm font-semibold text-text-color-dark-green px-3 py-2 rounded shadow-md hover:bg-red-700 m-auto"
                      onClick={() =>
                        handleDeleteCartItem(cart.cart_id, user.user_id)
                      }
                    >
                      Remove
                    </button>
                    <div className="flex bg-color-pallet-03 py-2 px-4 rounded-md font-semibold text-text-color-dark-green m-auto">
                      <button
                        className="w-4 h-4 transition-transform transform duration-300 hover:scale-110"
                        onClick={() =>
                          handleSetSelectedQuantity(
                            "minus",
                            cart.quantity,
                            cart.cart_id,
                            user.user_id,
                            cart.product_id
                          )
                        }
                      >
                        -
                      </button>
                      <div className="mx-4 w-6 text-center">
                        {cart.quantity}
                      </div>
                      <button
                        className="w-4 h-4 transition-transform transform duration-300 hover:scale-110"
                        onClick={() =>
                          handleSetSelectedQuantity(
                            "plus",
                            cart.quantity,
                            cart.cart_id,
                            user.user_id,
                            cart.product_id
                          )
                        }
                      >
                        +
                      </button>
                    </div>
                    <div className="p-2 font-semibold text-text-color-dark-green m-auto">
                      Price:{" "}
                      {formatCurrency(
                        productData.find((product) =>
                          product.product_variations.some(
                            (product_variation) =>
                              product_variation.product_variation_id ===
                              cart.product_variation_id
                          )
                        )?.base_price_in_pennies || 0
                      )}
                    </div>
                    <div className="p-2 font-semibold text-text-color-dark-green m-auto">
                      Total:{" "}
                      {formatCurrency(
                        (productData.find((product) =>
                          product.product_variations.some(
                            (product_variation) =>
                              product_variation.product_variation_id ===
                              cart.product_variation_id
                          )
                        )?.base_price_in_pennies || 0) * cart.quantity
                      )}
                    </div>
                  </div>
                </div>
              ))}
          </div>
          <div className="bg-color-pallet-02 shadow-md pb-6 mx-2 text-2xl text-center m-2">
            <div className="bg-color-pallet-03 p-2 font-semibold text-text-color-dark-green">
              Order Summary
            </div>
            <div className="flex justify-between p-2 font-semibold text-text-color-dark-green">
              <div>Items:</div>
              <div>
                {cartData.reduce(
                  (quantity, cart) => quantity + cart.quantity,
                  0
                )}
              </div>
            </div>
            <div className="flex justify-between p-2 font-semibold text-text-color-dark-green">
              <div>Total amount:</div>
              <div>
                {formatCurrency(
                  cartData.reduce((amount: number, cart) => {
                    const matchingCartItem = productData.find((product) =>
                      product.product_variations.some(
                        ({ product_variation_id }) =>
                          product_variation_id === cart.product_variation_id
                      )
                    );

                    if (matchingCartItem) {
                      return (
                        amount +
                        matchingCartItem.base_price_in_pennies * cart.quantity
                      );
                    }
                    return amount;
                  }, 0)
                )}
              </div>
            </div>
            <button className="bg-color-pallet-03 text-2xl font-bold text-text-color-dark-green px-24 py-2 rounded shadow-md m-2 hover:bg-color-pallet-04">
              Checkout
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
