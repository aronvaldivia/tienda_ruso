import React, { useState, useEffect } from 'react';
import { Search, ShoppingCart, Trash2, Send, Tag, ChevronLeft, ChevronRight, Coffee, Percent } from 'lucide-react';

// Types
interface Product {
  id: number;
  name: string;
  price: number;
  category: string;
  image: string;
}

interface CartItem extends Product {
  quantity: number;
}

function App() {
  // Sample product data for a food/grocery store
  const [products, setProducts] = useState<Product[]>([
    { id: 1, name: 'Manzanas Rojas (1kg)', price: 2.99, category: 'Frutas', image: 'https://images.unsplash.com/photo-1567306226416-28f0efdc88ce?auto=format&fit=crop&q=80&w=200&h=200' },
    { id: 2, name: 'Plátanos (1kg)', price: 1.99, category: 'Frutas', image: 'https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?auto=format&fit=crop&q=80&w=200&h=200' },
    { id: 3, name: 'Leche Entera (1L)', price: 1.49, category: 'Lácteos', image: 'https://images.unsplash.com/photo-1563636619-e9143da7973b?auto=format&fit=crop&q=80&w=200&h=200' },
    { id: 4, name: 'Queso Fresco (250g)', price: 3.99, category: 'Lácteos', image: 'https://images.unsplash.com/photo-1486297678162-eb2a19b0a32d?auto=format&fit=crop&q=80&w=200&h=200' },
    { id: 5, name: 'Pan Integral', price: 2.49, category: 'Panadería', image: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&q=80&w=200&h=200' },
    { id: 6, name: 'Donas Glaseadas (4 uds)', price: 3.99, category: 'Panadería', image: 'https://images.unsplash.com/photo-1551024601-bec78aea704b?auto=format&fit=crop&q=80&w=200&h=200' },
    { id: 7, name: 'Chocolate con Leche', price: 2.29, category: 'Golosinas', image: 'https://images.unsplash.com/photo-1511381939415-e44015466834?auto=format&fit=crop&q=80&w=200&h=200' },
    { id: 8, name: 'Gomitas Surtidas (200g)', price: 1.99, category: 'Golosinas', image: 'https://images.unsplash.com/photo-1582058091505-f87a2e55a40f?auto=format&fit=crop&q=80&w=200&h=200' },
    { id: 9, name: 'Arroz Blanco (1kg)', price: 2.49, category: 'Abarrotes', image: 'https://images.unsplash.com/photo-1586201375761-83865001e8ac?auto=format&fit=crop&q=80&w=200&h=200' },
    { id: 10, name: 'Aceite de Oliva (500ml)', price: 6.99, category: 'Abarrotes', image: 'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?auto=format&fit=crop&q=80&w=200&h=200' },
    { id: 11, name: 'Café Molido (250g)', price: 4.99, category: 'Bebidas', image: 'https://images.unsplash.com/photo-1559056199-641a0ac8b55e?auto=format&fit=crop&q=80&w=200&h=200' },
    { id: 12, name: 'Refresco Cola (2L)', price: 1.99, category: 'Bebidas', image: 'https://images.unsplash.com/photo-1554866585-cd94860890b7?auto=format&fit=crop&q=80&w=200&h=200' },
    { id: 13, name: 'Papas Fritas (150g)', price: 2.29, category: 'Snacks', image: 'https://images.unsplash.com/photo-1566478989037-eec170784d0b?auto=format&fit=crop&q=80&w=200&h=200' },
    { id: 14, name: 'Nachos con Queso (200g)', price: 2.99, category: 'Snacks', image: 'https://images.unsplash.com/photo-1513456852971-30c0b8199d4d?auto=format&fit=crop&q=80&w=200&h=200' },
    { id: 15, name: 'Huevos (12 uds)', price: 3.49, category: 'Frescos', image: 'https://images.unsplash.com/photo-1506976785307-8732e854ad03?auto=format&fit=crop&q=80&w=200&h=200' },
    { id: 16, name: 'Pasta Espagueti (500g)', price: 1.79, category: 'Abarrotes', image: 'https://images.unsplash.com/photo-1551462147-ff29053bfc14?auto=format&fit=crop&q=80&w=200&h=200' },
    { id: 17, name: 'Galletas Chocolate (250g)', price: 2.49, category: 'Golosinas', image: 'https://images.unsplash.com/photo-1499636136210-6f4ee915583e?auto=format&fit=crop&q=80&w=200&h=200' },
    { id: 18, name: 'Cereal de Maíz (400g)', price: 3.99, category: 'Desayuno', image: 'https://images.unsplash.com/photo-1521483451569-e33803c0330c?auto=format&fit=crop&q=80&w=200&h=200' },
  ]);

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [cart, setCart] = useState<CartItem[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>(products);
  const [currentPage, setCurrentPage] = useState(1);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [clickedButtons, setClickedButtons] = useState<Record<number, boolean>>({});

  // Products per page based on screen size
  const productsPerPage = isMobile ? 10 : 16; // 4x4 grid for desktop, 10 for mobile

  // Get unique categories
  const categories = ['All', ...Array.from(new Set(products.map(product => product.category)))];

  // Handle window resize for responsive design
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Filter products based on search term and selected category
  useEffect(() => {
    let result = products;
    
    if (searchTerm) {
      result = result.filter(product => 
        product.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    if (selectedCategory !== 'All') {
      result = result.filter(product => product.category === selectedCategory);
    }
    
    setFilteredProducts(result);
    setCurrentPage(1); // Reset to first page when filters change
  }, [searchTerm, selectedCategory, products]);

  // Get current products for pagination
  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = filteredProducts.slice(indexOfFirstProduct, indexOfLastProduct);
  const totalPages = Math.ceil(filteredProducts.length / productsPerPage);

  // Change page
  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);
  const nextPage = () => setCurrentPage(prev => Math.min(prev + 1, totalPages));
  const prevPage = () => setCurrentPage(prev => Math.max(prev - 1, 1));

  // Add product to cart with button animation
  const addToCart = (product: Product) => {
    // Set button as clicked
    setClickedButtons(prev => ({ ...prev, [product.id]: true }));
    
    // Reset button state after animation
    setTimeout(() => {
      setClickedButtons(prev => ({ ...prev, [product.id]: false }));
    }, 300);
    
    // Add to cart
    setCart(prevCart => {
      const existingItem = prevCart.find(item => item.id === product.id);
      
      if (existingItem) {
        return prevCart.map(item => 
          item.id === product.id 
            ? { ...item, quantity: item.quantity + 1 } 
            : item
        );
      } else {
        return [...prevCart, { ...product, quantity: 1 }];
      }
    });
  };

  // Remove one unit of a product from cart
  const removeOneFromCart = (productId: number) => {
    setCart(prevCart => {
      const existingItem = prevCart.find(item => item.id === productId);
      
      if (existingItem && existingItem.quantity > 1) {
        // If quantity > 1, decrease quantity by 1
        return prevCart.map(item => 
          item.id === productId 
            ? { ...item, quantity: item.quantity - 1 } 
            : item
        );
      } else {
        // If quantity is 1, remove the item completely
        return prevCart.filter(item => item.id !== productId);
      }
    });
  };

  // Calculate total price
  const totalPrice = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  // Send order via WhatsApp
  const sendOrderViaWhatsApp = () => {
    if (cart.length === 0) return;

    const phoneNumber = "1234567890"; // Replace with the store's WhatsApp number
    const message = `Nueva orden:\n\n${cart.map(item => 
      `${item.name} x${item.quantity} - $${(item.price * item.quantity).toFixed(2)}`
    ).join('\n')}\n\nTotal: $${totalPrice.toFixed(2)}`;

    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header with Logo */}
      <header className="bg-green-700 text-white p-4 shadow-md">
        <div className="container mx-auto flex justify-center items-center">
          <div className="flex items-center space-x-2">
            <Coffee size={32} />
            <h1 className="text-2xl font-bold">SuperMercado</h1>
          </div>
        </div>
      </header>

      {/* Promotional Flyer Section */}
      <div className="bg-cover bg-center" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&q=80&w=1200&h=400')" }}>
        <div className="bg-gradient-to-r from-green-900/80 to-green-700/60 py-8 md:py-12">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto text-center">
              <div className="bg-white/90 backdrop-blur-sm rounded-lg p-6 shadow-lg">
                <div className="inline-block bg-red-600 text-white px-4 py-1 rounded-full mb-3 animate-pulse">
                  <div className="flex items-center">
                    <Percent size={16} className="mr-1" />
                    <span className="font-bold text-sm">OFERTA ESPECIAL</span>
                  </div>
                </div>
                <h2 className="text-2xl md:text-3xl font-bold text-green-800 mb-2">¡Gran Venta de Fin de Semana!</h2>
                <p className="text-gray-700 mb-4">Aprovecha 30% de descuento en todos los productos de panadería y frutas frescas.</p>
                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                  <div className="bg-green-100 p-3 rounded-lg flex items-center">
                    <img src="https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&q=80&w=100&h=100" 
                      alt="Pan" className="w-16 h-16 object-cover rounded mr-3" />
                    <div className="text-left">
                      <p className="font-bold text-green-800">Panadería</p>
                      <p className="text-sm line-through">$3.99</p>
                      <p className="text-lg font-bold text-red-600">$2.79</p>
                    </div>
                  </div>
                  <div className="bg-green-100 p-3 rounded-lg flex items-center">
                    <img src="https://images.unsplash.com/photo-1567306226416-28f0efdc88ce?auto=format&fit=crop&q=80&w=100&h=100" 
                      alt="Manzanas" className="w-16 h-16 object-cover rounded mr-3" />
                    <div className="text-left">
                      <p className="font-bold text-green-800">Frutas</p>
                      <p className="text-sm line-through">$2.99</p>
                      <p className="text-lg font-bold text-red-600">$2.09</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Search Section with Background */}
      <div className="bg-gradient-to-r from-green-100 to-green-200 py-6 shadow-inner">
        <div className="container mx-auto px-4">
          <div className="relative max-w-md mx-auto">
            <input
              type="text"
              placeholder="Buscar productos..."
              className="w-full py-3 px-4 pr-10 rounded-full text-gray-800 focus:outline-none focus:ring-2 focus:ring-green-500 shadow-md"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <Search className="absolute right-3 top-3.5 text-gray-500" size={20} />
          </div>
        </div>
      </div>

      <main className="container mx-auto p-4">
        {/* Category Filter */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4 flex items-center">
            <Tag className="mr-2" /> Categorías
          </h2>
          <div className="flex flex-wrap gap-2">
            {categories.map(category => (
              <button
                key={category}
                className={`px-4 py-2 rounded-full ${
                  selectedCategory === category
                    ? 'bg-green-600 text-white'
                    : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
                }`}
                onClick={() => setSelectedCategory(category)}
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        {/* Product Catalog */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Catálogo de Productos</h2>
            <div className="text-sm text-gray-600">
              Mostrando {indexOfFirstProduct + 1}-{Math.min(indexOfLastProduct, filteredProducts.length)} de {filteredProducts.length} productos
            </div>
          </div>
          
          {filteredProducts.length === 0 ? (
            <div className="bg-white rounded-lg shadow-md p-8 text-center">
              <p className="text-gray-500">No se encontraron productos que coincidan con tu búsqueda.</p>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {currentProducts.map(product => (
                  <div key={product.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
                    <img 
                      src={product.image} 
                      alt={product.name} 
                      className="w-full h-48 object-cover"
                    />
                    <div className="p-4">
                      <h3 className="font-semibold text-lg mb-1">{product.name}</h3>
                      <p className="text-green-600 font-bold mb-2">${product.price.toFixed(2)}</p>
                      <p className="text-sm text-gray-600 mb-3">{product.category}</p>
                      <button
                        className={`w-full py-2 rounded transition-all transform duration-300 ${
                          clickedButtons[product.id]
                            ? 'bg-green-800 text-white scale-95 shadow-inner'
                            : 'bg-green-600 text-white hover:bg-green-700'
                        }`}
                        onClick={() => addToCart(product)}
                      >
                        {clickedButtons[product.id] ? '¡Agregado!' : 'Agregar al Carrito'}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
              
              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex justify-center mt-8">
                  <nav className="flex items-center space-x-2">
                    <button 
                      onClick={prevPage} 
                      disabled={currentPage === 1}
                      className={`p-2 rounded-full ${currentPage === 1 ? 'text-gray-400 cursor-not-allowed' : 'text-green-600 hover:bg-green-100'}`}
                    >
                      <ChevronLeft size={20} />
                    </button>
                    
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map(number => {
                      // Show limited page numbers with ellipsis for better UX
                      if (
                        number === 1 || 
                        number === totalPages || 
                        (number >= currentPage - 1 && number <= currentPage + 1)
                      ) {
                        return (
                          <button
                            key={number}
                            onClick={() => paginate(number)}
                            className={`w-10 h-10 rounded-full ${
                              currentPage === number
                                ? 'bg-green-600 text-white'
                                : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
                            }`}
                          >
                            {number}
                          </button>
                        );
                      } else if (
                        (number === currentPage - 2 && currentPage > 3) || 
                        (number === currentPage + 2 && currentPage < totalPages - 2)
                      ) {
                        return <span key={number} className="px-1">...</span>;
                      }
                      return null;
                    })}
                    
                    <button 
                      onClick={nextPage} 
                      disabled={currentPage === totalPages}
                      className={`p-2 rounded-full ${currentPage === totalPages ? 'text-gray-400 cursor-not-allowed' : 'text-green-600 hover:bg-green-100'}`}
                    >
                      <ChevronRight size={20} />
                    </button>
                  </nav>
                </div>
              )}
            </>
          )}
        </div>

        {/* Shopping Cart */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4 flex items-center">
            <ShoppingCart className="mr-2" /> Tu Lista de Compras
          </h2>
          
          {cart.length === 0 ? (
            <p className="text-gray-500 italic">Tu lista está vacía. Agrega productos del catálogo.</p>
          ) : (
            <>
              <div className="divide-y">
                {cart.map(item => (
                  <div key={item.id} className="py-3 flex justify-between items-center">
                    <div className="flex items-center">
                      <img 
                        src={item.image} 
                        alt={item.name} 
                        className="w-12 h-12 object-cover rounded mr-4"
                      />
                      <div>
                        <h3 className="font-medium">{item.name}</h3>
                        <p className="text-sm text-gray-600">
                          ${item.price.toFixed(2)} x {item.quantity} = ${(item.price * item.quantity).toFixed(2)}
                        </p>
                      </div>
                    </div>
                    <button
                      className="text-red-500 hover:text-red-700"
                      onClick={() => removeOneFromCart(item.id)}
                      title="Eliminar uno"
                    >
                      <Trash2 size={20} />
                    </button>
                  </div>
                ))}
              </div>
              
              <div className="mt-4 pt-4 border-t">
                <div className="flex justify-between items-center mb-4">
                  <span className="font-semibold text-lg">Total:</span>
                  <span className="font-bold text-xl text-green-600">${totalPrice.toFixed(2)}</span>
                </div>
                
                <button
                  className="w-full bg-green-600 text-white py-3 rounded-lg flex items-center justify-center hover:bg-green-700 transition-colors"
                  onClick={sendOrderViaWhatsApp}
                >
                  <Send className="mr-2" size={20} />
                  Enviar Pedido por WhatsApp
                </button>
              </div>
            </>
          )}
        </div>
      </main>

      <footer className="bg-gray-800 text-white py-6">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center mb-4 md:mb-0">
              <Coffee size={24} className="mr-2" />
              <span className="font-bold text-xl">SuperMercado</span>
            </div>
            <div className="text-center md:text-right">
              <p>© 2025 SuperMercado. Todos los derechos reservados.</p>
              <p className="text-sm text-gray-400 mt-1">La mejor tienda para todos tus productos</p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;