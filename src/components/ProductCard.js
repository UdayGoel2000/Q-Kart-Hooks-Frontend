import { AddShoppingCartOutlined } from "@mui/icons-material";
import {
  Button,
  Card,
  CardActions,
  CardContent,
  CardMedia,
  Rating,
  Typography,
  CardActionArea
} from "@mui/material";
import React from "react";
import "./ProductCard.css";

const ProductCard = ({ product,cart, handleAddToCart }) => {
  // console.log(product,handleAddToCart)
  const {name,category,cost,rating,image,_id} = product
  const token = localStorage.getItem("token");

  return (
    <Card className="card">
      <CardActionArea>
        <CardMedia component="img" height="140" image={image} alt={name} />
        <CardContent>
          <Typography variant="subtitle1">{name}</Typography>
          <Typography variant="subtitle2">${cost}</Typography>
          <Rating name="read-only" value={rating} readOnly />
        </CardContent>
      </CardActionArea>
      <CardActions className = "card-actions">
        <Button 
        className = "card-button" 
        fullWidth 
        variant="contained" 
        startIcon={<AddShoppingCartOutlined />}
        onClick = {() => handleAddToCart(token,cart,product,_id,1,{preventDuplicate:true})}
        >
          ADD TO CART
        </Button>
      </CardActions>
    </Card>
  );
};

export default ProductCard;
