import {
  AddOutlined,
  RemoveOutlined,
  ShoppingCart,
  ShoppingCartOutlined,
} from "@mui/icons-material";
import { Button, IconButton, Stack } from "@mui/material";
import { Box } from "@mui/system";
import React from "react";
import { useHistory } from "react-router-dom";
import "./Cart.css";

// Definition of Data Structures used
/**
 * @typedef {Object} Product - Data on product available to buy
 * 
 * @property {string} name - The name or title of the product
 * @property {string} category - The category that the product belongs to
 * @property {number} cost - The price to buy the product
 * @property {number} rating - The aggregate rating of the product (integer out of five)
 * @property {string} image - Contains URL for the product image
 * @property {string} _id - Unique ID for the product
 */

/**
 * @typedef {Object} CartItem -  - Data on product added to cart
 * 
 * @property {string} name - The name or title of the product in cart
 * @property {string} qty - The quantity of product added to cart
 * @property {string} category - The category that the product belongs to
 * @property {number} cost - The price to buy the product
 * @property {number} rating - The aggregate rating of the product (integer out of five)
 * @property {string} image - Contains URL for the product image
 * @property {string} productId - Unique ID for the product
 */

/**
 * Returns the complete data on all products in cartData by searching in productsData
 *
 * @param { Array.<{ productId: String, qty: Number }> } cartData
 *    Array of objects with productId and quantity of products in cart
 * 
 * @param { Array.<Product> } productsData
 *    Array of objects with complete data on all available products
 *
 * @returns { Array.<CartItem> }
 *    Array of objects with complete data on products in cart
 *
 */
export const generateCartItemsFrom = (cartData, productsData) => {
  if (!cartData) return;
  // console.log(cartData,productsData)
  let cartCompleteData = cartData.map(cartItem=> {
    // console.log(cartItem)
    let Z1 = productsData.filter(products => products._id === cartItem.productId)
    // console.log(Z1)
    
    return {
      ...cartItem,
      ...Z1[0],
      totalCost: Z1[0].cost*cartItem.qty
    }
  })
  // console.log(cartCompleteData)
  return cartCompleteData
};

// export const generateCartItemsFrom = (cartData, productsData) => {
//   if (!cartData) return;

//   const newCart = cartData.map((item) => ({
//     ...item,
//     ...productsData.find((product) => product._id === item.productId),
//   }));
//   console.log(newCart)
//   return newCart;
// };

/**
 * Get the total value of all products added to the cart
 *
 * @param { Array.<CartItem> } items
 *    Array of objects with complete data on products added to the cart
 *
 * @returns { Number }
 *    Value of all items in the cart
 *
 */
export const getTotalCartValue = (items = []) => {
  // console.log(items)
  if(!items) return;
  return items.reduce((a,c) => a+c.totalCost,0);
};

export const getTotalItems = (items = []) => {
	return items.map((x) => parseInt(x.qty)).reduce((p, c) => p + c, 0);
};

/**
 * Component to display the current quantity for a product and + and - buttons to update product quantity on cart
 * 
 * @param {Number} value
 *    Current quantity of product in cart
 * 
 * @param {Function} handleAdd
 *    Handler function which adds 1 more of a product to cart
 * 
 * @param {Function} handleDelete
 *    Handler function which reduces the quantity of a product in cart by 1
 * 
 * @param {Boolean} isReadOnly
 *    If product quantity on cart is to be displayed as read only without the + - options to change quantity
 * 
 */
const ItemQuantity = ({
  value,
  handleAdd,
  handleDelete,
}) => {
  return (
    <Stack direction="row" alignItems="center">
      <IconButton size="small" color="primary" onClick={handleDelete}>
        <RemoveOutlined />
      </IconButton>
      <Box padding="0.5rem" data-testid="item-qty">
        {value}
      </Box>
      <IconButton size="small" color="primary" onClick={handleAdd}>
        <AddOutlined />
      </IconButton>
    </Stack>
  );
};

/**
 * Component to display the Cart view
 * 
 * @param { Array.<Product> } products
 *    Array of objects with complete data of all available products
 * 
 * @param { Array.<Product> } items
 *    Array of objects with complete data on products in cart
 * 
 * @param {Function} handleDelete
 *    Current quantity of product in cart
 * 
 * @param {Boolean} isReadOnly
 *    If product quantity on cart is to be displayed as read only without the + - options to change quantity
 * 
 */
const Cart = ({
  products,
  items = [],
  handleQuantity,
  isReadOnly
}) => {

  const cartDetailedItems = generateCartItemsFrom(items, products);
  // console.log(cartDetailedItems)
  const history = useHistory();
  const token = localStorage.getItem("token");

  if (!items.length) {
    return (
      <Box className="cart empty">
        <ShoppingCartOutlined className="empty-cart-icon" />
        <Box color="#aaa" textAlign="center">
          Cart is empty. Add more items to the cart to checkout.
        </Box>
      </Box>
    );
  }

  return (
    <>
      <Box className="cart">
        {cartDetailedItems.map(cartDetailedItem => {    
          return <Box display="flex" alignItems="flex-start" padding="1rem" key = {cartDetailedItem._id}>
              <Box className="image-container">
                  <img
                      // Add product image
                      src={cartDetailedItem.image}
                      // Add product name as alt eext
                      alt={cartDetailedItem.name}
                      width="100%"
                      height="100%"
                  />
              </Box>
              <Box
                  display="flex"
                  flexDirection="column"
                  justifyContent="space-between"
                  height="6rem"
                  paddingX="1rem"
              >
                  <div>{cartDetailedItem.name}</div>
                  <Box
                      display="flex"
                      justifyContent="space-between"
                      alignItems="center"
                  >
                  {isReadOnly
                  ?
                    <Box component="div" padding="0.5rem">
                      Qty: {cartDetailedItem.qty}
                    </Box>
                  :
                    <ItemQuantity
                    value = {cartDetailedItem.qty}
                    handleAdd = {() => {
                        // e.stopPropagation();
                        handleQuantity(token,
                                      items,
                                      products,
                                      cartDetailedItem._id,
                                      cartDetailedItem.qty+1,
                                      { preventDuplicate: false })
                      }
                    }
                    handleDelete = {() => {
                        // e.stopPropagation();
                        handleQuantity(token,
                          items,
                          products,
                          cartDetailedItem._id,
                          cartDetailedItem.qty-1,
                          { preventDuplicate: false })
                      }
                    }
                    // Add required props by checking implementation
                    />
                  }
                  
                  <Box padding="0.5rem" fontWeight="700">
                      ${cartDetailedItem.cost}
                  </Box>
                  </Box>
              </Box>
          </Box>
        })}
        {/* TODO: CRIO_TASK_MODULE_CART - Display view for each cart item with non-zero quantity */}
        <Box
          padding="1rem"
          display="flex"
          justifyContent="space-between"
          alignItems="center"
        >
          <Box color="#3C3C3C" alignSelf="center">
            Order total
          </Box>
          <Box
            color="#3C3C3C"
            fontWeight="700"
            fontSize="1.5rem"
            alignSelf="center"
            data-testid="cart-total"
          >
            ${getTotalCartValue(cartDetailedItems)}
          </Box>
        </Box>

        {!isReadOnly && (
					<Box display="flex" justifyContent="flex-end" className="cart-footer">
						<Button
							color="primary"
							variant="contained"
							startIcon={<ShoppingCart />}
							className="checkout-btn"
							onClick={() =>
								history.push("/checkout")
							}
						>
							Checkout
						</Button>
					</Box>
				)}
      </Box>
    </>
  );
};

export default Cart;
