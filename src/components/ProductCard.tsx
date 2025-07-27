import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ShoppingCart, Eye } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useCart } from '@/hooks/useCart';

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  image_url: string;
  sizes: string[];
  featured: boolean;
  stock_quantity: number;
}

interface ProductCardProps {
  product: Product;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const [selectedSize, setSelectedSize] = useState<string>('');
  const { addToCart } = useCart();

  const handleAddToCart = async () => {
    if (!selectedSize) {
      return;
    }
    await addToCart(product.id, selectedSize);
    setSelectedSize('');
  };

  return (
    <div className="group relative bg-card rounded-lg shadow-md overflow-hidden transition-transform hover:scale-105">
      {product.featured && (
        <Badge className="absolute top-2 left-2 z-10 bg-primary">
          Featured
        </Badge>
      )}
      
      <div className="relative overflow-hidden">
        <img
          src={product.image_url}
          alt={product.name}
          className="w-full h-64 object-cover transition-transform group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-opacity flex items-center justify-center opacity-0 group-hover:opacity-100">
          <Link to={`/product/${product.id}`}>
            <Button variant="secondary" size="sm">
              <Eye className="w-4 h-4 mr-2" />
              View Details
            </Button>
          </Link>
        </div>
      </div>

      <div className="p-4">
        <h3 className="text-lg font-semibold mb-2 text-foreground">{product.name}</h3>
        <p className="text-muted-foreground text-sm mb-3 line-clamp-2">
          {product.description}
        </p>
        
        <div className="flex items-center justify-between mb-3">
          <span className="text-xl font-bold text-primary">
            ${product.price.toFixed(2)}
          </span>
          <span className="text-sm text-muted-foreground">
            {product.stock_quantity > 0 ? `${product.stock_quantity} in stock` : 'Out of stock'}
          </span>
        </div>

        <div className="space-y-2">
          <Select value={selectedSize} onValueChange={setSelectedSize}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select size" />
            </SelectTrigger>
            <SelectContent>
              {product.sizes.map((size) => (
                <SelectItem key={size} value={size}>
                  {size}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Button
            className="w-full"
            onClick={handleAddToCart}
            disabled={!selectedSize || product.stock_quantity === 0}
          >
            <ShoppingCart className="w-4 h-4 mr-2" />
            Add to Cart
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;