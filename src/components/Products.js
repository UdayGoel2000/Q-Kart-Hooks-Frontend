import ShoppingCartOutlinedIcon from '@mui/icons-material/ShoppingCartOutlined';
import { Search, SentimentDissatisfied } from "@mui/icons-material";
import {
  CircularProgress,
  Grid,
  InputAdornment,
  TextField,
} from "@mui/material";
import { Box } from "@mui/system";
import axios from "axios";
import { useSnackbar } from "notistack";
import React, { useEffect, useState } from "react";
import { config } from "../App";
import Footer from "./Footer";
import Header from "./Header";
import Cart from "./Cart"
import "./Products.css";
import ProductCard from "./ProductCard"
import { Stack,Typography } from "@mui/material";

// Definition of Data Structures used
/**
 * @typedef {Object} Product - Data on product available to buy
 * 
 * @property {string} name - The name or title of the product


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

const Products = () => {
  const { enqueueSnackbar } = useSnackbar();

  /**
   * Make API call to get the products list and store it to display the products
   *
   * @returns { Array.<Product> }
   *      Array of objects with complete data on all available products
   *
   * API endpoint - "GET /products"
   *
   * Example for successful response from backend:
   * HTTP 200
   * [
   *      {
   *          "name": "iPhone XR",d
   *          "category": "Phones",
   *          "cost": 100,
   *          "rating": 4,
   *          "image": "https://i.imgur.com/lulqWzW.jpg",
   *          "_id": "v4sLtEcMpzabRyfx"
   *      },
   *      {
   *          "name": "Basketball",
   *          "category": "Sports",
   *          "cost": 100,
   *          "rating": 5,
   *          "image": "https://i.imgur.com/lulqWzW.jpg",
   *          "_id": "upLK9JbQ4rMhTwt4"
   *      }
   * ]
   *
   * Example for failed response from backend:
   * HTTP 500
   * {
   *      "success": false,
   *      "message": "Something went wrong. Check the backend console for more details"
   * }
   */

  const [loading,setLoading] = useState(true);
  const [productList,setProductsList] = useState([]);
  const [cartItems,setCartItems] = useState('');
  const [debounceTimeout,setDebounceTimeout] = useState(0);
  // const [check,setCheck] = useState(false)

  useEffect(() => {
    performAPICall();
    // if(localStorage.getItem("username")){
      fetchCart(localStorage.getItem("token"))
    // }
  }, []);

  // useEffect(() => {
  //   // console.log("hi")
  //   let timer
  //   if (searchField){
  //     timer = setTimeout(() => {
  //       // console.log("hi")
  //       performSearch(searchField);},500)
  //   }
  //   else{
  //     timer = setTimeout(() => {performAPICall();},500)
  //   }
    
  //   return () =>{
  //     clearTimeout(timer);
  //   }
  // }, [searchField]);

  const performAPICall = async () => {
    try{
      let res = await axios.get(`${config.endpoint}/products`)
      setProductsList(res.data);
    }
    catch(e){
      console.log(e)
    }
    setLoading(false)  
  };

  // TODO: CRIO_TASK_MODULE_PRODUCTS - Implement search logic
  /**
   * Definition for search handler
   * This is the function that is called on adding new search keys
   *
   * @param {string} text
   *    Text user types in the search bar. To filter the displayed products based on this text.
   *
   * @returns { Array.<Product> }
   *      Array of objects with complete data on filtered set of products
   *
   * API endpoint - "GET /products/search?value=<search-query>"
   *
   */
  const performSearch = async (text) => {
    setLoading(true);
    try{
      let res = await axios.get(`${config.endpoint}/products/search?value=${text}`)
      setProductsList(res.data);
    }
    catch(err){
      // console.log(e)
      setProductsList([]);
      if (err.response && err.response.status === 404) {
        console.log(productList)
      }
    }
    setLoading(false)  
  };

  // TODO: CRIO_TASK_MODULE_PRODUCTS - Optimise API calls with debounce search implementation
  /**
   * Definition for debounce handler
   * With debounce, this is the function to be called whenever the user types text in the searchbar field
   *
   * @param {{ target: { value: string } }} event
   *    JS event object emitted from the search input field
   *
   * @param {NodeJS.Timeout} debounceTimeout
   *    Timer id set for the previous debounce call
   *
   */
  const debounceSearch = (event, debounceTimeout) => {
    if(debounceTimeout){
      clearTimeout(debounceTimeout)
    }
    let timer
    if(event){
      timer = setTimeout(() => {performSearch(event.target.value);},500)
      setDebounceTimeout(timer)
    }
    else{
      performAPICall()
  };
};


  /**
   * Perform the API call to fetch the user's cart and return the response
   *
   * @param {string} token - Authentication token returned on login
   *
   * @returns { Array.<{ productId: string, qty: number }> | null }
   *    The response JSON object
   *
   * Example for successful response from backend:
   * HTTP 200
   * [
   *      {
   *          "productId": "KCRwjF7lN97HnEaY",
   *          "qty": 3
   *      },
   *      {
   *          "productId": "BW0jAAeDJmlZCF8i",
   *          "qty": 1
   *      }
   * ]
   *
   * Example for failed response from backend:
   * HTTP 401
   * {
   *      "success": false,
   *      "message": "Protected route, Oauth2 Bearer token not found"
   * }
   */
  const fetchCart = async (token) => {
    if (!token) return;
    let url = `${config.endpoint}/cart`
    // console.log(url);
    try {
      // TODO: CRIO_TASK_MODULE_CART - Pass Bearer token inside "Authorization" header to get data from "GET /cart" API and return the response data
      // curl 'http://localhost:8082/api/v1/cart' -H 'Authorization: Bearer <token>'
      let res  = await axios.get(url,{headers:{'Authorization': `Bearer ${token}`}})
      // console.log(res.data)
      setCartItems(res.data)
      return res.data;

    } catch (e) {
      if (e.response && e.response.status === 400) {
        enqueueSnackbar(e.response.data.message, { variant: "error" });
      } else {
        enqueueSnackbar(
          "Could not fetch cart details. Check that the backend is running, reachable and returns valid JSON.",
          {
            variant: "error",
          }
        );
      }
      return null;
    }
  };

  const addToCart = async (
    token,
    items,
    products,
    productId,
    qty,
    options = { preventDuplicate: false }
  ) => {
    if(!token){
      enqueueSnackbar('Login to add an item to the Cart.', {variant: 'warning'});
    return;
    }
    if(options.preventDuplicate && isItemInCart(items,productId)){
      enqueueSnackbar('Item already in cart. Use the cart sidebar to update quantity or remove item.',{variant: 'warning'});
    return;
    }
    try{
      let url = `${config.endpoint}/cart`
      let res  = await axios.post(url,
                                  { productId: productId, qty: qty },
                                  {headers:{'Authorization': `Bearer ${token}`}})
      setCartItems(res.data);
      enqueueSnackbar('Items updated in cart.', {
        variant: 'success',
      });
    }
    catch(e){
      if (e.response && e.response.status === 400) {
        enqueueSnackbar(e.response.data.message, { variant: 'error' });
    } else {
        console.log(e.response)
        enqueueSnackbar('Could not fetch cart details. Check that the backend is running, reachable and returns valid JSON.',{variant: 'error'});
    }
    setCartItems([]);
    }
  };
// let prodList = 
// {
// "name":"Tan Leatherette Weekender Duffle",
// "category":"Fashion",
// "cost":150,
// "rating":4,
// "image":"https://crio-directus-assets.s3.ap-south-1.amazonaws.com/ff071a1c-1099-48f9-9b03-f858ccc53832.png",
// "_id":"PmInA797xJhMIPti"
// }
let userName = localStorage.getItem("username")
  // if(userName)
  //   setCheck(true)

let loadingGrid = (
  <Grid container spacing={2}>
    <Grid item xs={12}>
    <Stack
          direction="column"
          justifyContent="center"
          alignItems="center"
      >
        {/* <Box display="flex" justifyContent="center"> */}
        <CircularProgress color="success" />
        {/* </Box> */}
        {/* <Box display="flex" justifyContent="center">Loading Products...</Box> */}
        <Typography variant="caption" display="block">
            {'Loading Products...'}
        </Typography>
      </Stack>
    </Grid>
  </Grid>
)

let ProdGrid = (
  <Grid container spacing={2} my={2} px={2}>
    {productList.map((prod) => {
      return(
        <Grid item xs={12} sm={6} md={userName?6:3} lg={3} key={prod._id}>
          <ProductCard 
          product = {prod}
          cart = {cartItems}
          handleAddToCart ={addToCart}
          />
        </Grid>
      );
    })}
  </Grid>
)

// let logoutProdGrid = (
//   <Grid container spacing={2} my={1}>
//     {productList.map((prod) => {
//       return(
//         <Grid item xs={12} sm={6} md={3} key={prod._id}>
//           <ProductCard 
//           product = {prod}
//           />
//         </Grid>
//       );
//     })}
//   </Grid>
// )

let noProdGrid = (
  <Grid container spacing={2}>
    <Grid item xs={12}>
      <Stack
          direction="column"
          justifyContent="center"
          alignItems="center"
      >
        <SentimentDissatisfied />
        <Typography variant="caption" display="block">
            {'No products found'}
        </Typography>
      </Stack>
    </Grid>
  </Grid>
)
let mainGrid = (
  productList.length
  ?
  ProdGrid
  :
  noProdGrid
)
  // TODO: CRIO_TASK_MODULE_CART - Return if a product already exists in the cart
  /**
   * Return if a product already is present in the cart
   *
   * @param { Array.<{ productId: String, quantity: Number }> } items
   *    Array of objects with productId and quantity of products in cart
   * @param { String } productId
   *    Id of a product to be checked
   *
   * @returns { Boolean }
   *    Whether a product of given "productId" exists in the "items" array
   *
   */
  const isItemInCart = (items, productId) => {
    return items.map(ele => ele.productId).includes(productId)
  };

  /**
   * Perform the API call to add or update items in the user's cart and update local cart data to display the latest cart
   *
   * @param {string} token
   *    Authentication token returned on login
   * @param { Array.<{ productId: String, quantity: Number }> } items
   *    Array of objects with productId and quantity of products in cart
   * @param { Array.<Product> } products
   *    Array of objects with complete data on all available products
   * @param {string} productId
   *    ID of the product that is to be added or updated in cart
   * @param {number} qty
   *    How many of the product should be in the cart
   * @param {boolean} options
   *    If this function was triggered from the product card's "Add to Cart" button
   *
   * Example for successful response from backend:
   * HTTP 200 - Updated list of cart items
   * [
   *      {
   *          "productId": "KCRwjF7lN97HnEaY",
   *          "qty": 3
   *      },
   *      {
   *          "productId": "BW0jAAeDJmlZCF8i",
   *          "qty": 1
   *      }
   * ]
   *
   * Example for failed response from backend:
   * HTTP 404 - On invalid productId
   * {
   *      "success": false,
   *      "message": "Product doesn't exist"
   * }
   */


  

  let logoutView = (
    <>
    <TextField
        className="search-mobile"
        size="small"
        fullWidth
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              <Search color="primary" />
            </InputAdornment>
          ),
        }}
        placeholder="Search for items/categories"
        onChange={(e)=>{debounceSearch(e,debounceTimeout)}}
        name="search"
      />
       <Grid container>
         <Grid item className="product-grid">
           <Box className="hero">
             <p className="hero-heading">
               India’s <span className="hero-highlight">FASTEST DELIVERY</span>{" "}
               to your door step
             </p>
           </Box>
           {
           loading
           ?
           loadingGrid           
           :
           mainGrid
          }
          {/* {prodGrid} */}
            
         </Grid>
        
       </Grid>
    </>
  );
  let loginView = (
    <>
    {/* <Grid container spacing={2}> */}
      {/* <Grid item xs={12} lg={9}> */}
      {/* Search view for mobiles */}
        <TextField
          className="search-mobile"
          size="small"
          fullWidth
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <Search color="primary" />
              </InputAdornment>
            ),
          }}
          placeholder="Search for items/categories"
          onChange={(e)=>{debounceSearch(e,debounceTimeout)}}
          name="search"
        />
       <Grid container>
         <Grid item className="product-grid" xs={12} lg={9}>
           <Box className="hero">
             <p className="hero-heading">
               India’s <span className="hero-highlight">FASTEST DELIVERY</span>{" "}
               to your door step
             </p>
           </Box>
           {
           loading
           ?
           loadingGrid           
           :
           mainGrid
          }
          {/* {prodGrid} */}
            
         </Grid>
       {/* </Grid> */}
      {/* </Grid> */}
        <Grid 
        // id="mainGridSubGrid2" 
        item xs={12} lg={3} p={1} style={{backgroundColor:'#E9F5E1'}}>

          
          {/* <Grid container>
            <Grid item className="cartGrid"> */}
              {/* <Stack
              className="cartGridStack"
              direction="column"
              justifyContent="center"
              alignItems="center"
              m={1}
              >
                <ShoppingCartOutlinedIcon color="disabled" fontSize="large" />
                <Typography color="text.secondary" sx={{ fontSize: 12 }} variant="caption" display="div">
                    {'Cart is empty. Add more item to the cart to checkout'}
                </Typography>
              </Stack> */}
              {/* <Cart /> */}
              <Cart products={productList} items={cartItems} handleQuantity={addToCart}/>
            {/* </Grid>
          </Grid> */}

        </Grid>
    </Grid>
    </>
  );

  return (
    <div>
      <Header>
        {/* TODO: CRIO_TASK_MODULE_PRODUCTS - Display search bar in the header for Products page */}
        <TextField 
        className = 'search-desktop'
        size="small"
        // variant='standard'
        // fullWidth
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              <Search color="primary" />
            </InputAdornment>
          ),
        }}
        placeholder="Search for items/categories"
        onChange={(e)=>{debounceSearch(e,debounceTimeout)}}
        // label="Search for items/categories"
        name="search"
        />

      </Header>
      {/* Search view for mobiles */}
      {userName?loginView:logoutView}
      <Footer />
    </div>
  );
};

export default Products;
