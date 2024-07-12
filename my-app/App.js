import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { FlatList, Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

// Replace the URL with the actual endpoint of your API
const API_URL = 'https://fakestoreapi.com/products';

const App = () => {
  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState([]);
  const [screen, setScreen] = useState('Home');
  const [selectedProduct, setSelectedProduct] = useState(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get(API_URL);
        setProducts(response.data);
      } catch (error) {
        console.error('Error fetching products:', error);
      }
    };

    fetchProducts();

    const loadCart = async () => {
      const cartData = await AsyncStorage.getItem('cart');
      if (cartData) {
        setCart(JSON.parse(cartData));
      }
    };
    loadCart();
  }, []);

  const addToCart = async (product) => {
    const newCart = [...cart, product];
    setCart(newCart);
    await AsyncStorage.setItem('cart', JSON.stringify(newCart));
  };

  const removeFromCart = async (product) => {
    const newCart = cart.filter((item) => item.id !== product.id);
    setCart(newCart);
    await AsyncStorage.setItem('cart', JSON.stringify(newCart));
  };

  const renderProduct = ({ item }) => (
    <TouchableOpacity onPress={() => { setSelectedProduct(item); setScreen('ProductDetail'); }}>
      <View style={styles.productWrapper}>
        <View style={styles.productImageContainer}>
          <Image source={{ uri: item.image }} style={styles.productImage} />
          <TouchableOpacity style={styles.addIconContainer} onPress={() => addToCart(item)}>
            <Image source={require('./images/add_circle.png')} style={styles.addIcon} />
            {cart.filter(product => product.id === item.id).length > 0 &&
              <Text style={styles.cartCount}>{cart.filter(product => product.id === item.id).length}</Text>
            }
          </TouchableOpacity>
        </View>
        <Text style={styles.categoryText}>{item.category}</Text>
        <Text style={styles.productName}>{item.name}</Text>
        <Text style={styles.productPrice}>${item.price}</Text>
      </View>
    </TouchableOpacity>
  );

  const renderCartItem = ({ item }) => (
    <View style={styles.cartItemContainer}>
      <Image source={{ uri: item.image }} style={styles.cartItemImage} />
      <View style={styles.cartItemDetails}>
        <Text style={styles.productText}>{item.category}</Text>
        <Text style={styles.productName}>{item.name}</Text>
        <Text style={styles.productPrice}>${item.price}</Text>
        <TouchableOpacity style={styles.removeIconContainer} onPress={() => removeFromCart(item)}>
          <Image source={require('./images/remove.png')} style={styles.removeIcon} />
        </TouchableOpacity>
      </View>
    </View>
  );

  const renderProductDetail = () => (
    <View style={styles.productDetailContainer}>
      <Image source={{ uri: selectedProduct.image }} style={styles.detailImage} />
      <Text style={styles.detailCategory}>{selectedProduct.category}</Text>
      <Text style={styles.detailName}>{selectedProduct.name}</Text>
      <Text style={styles.detailPrice}>${selectedProduct.price}</Text>
      <Text style={styles.detailDescription}>{selectedProduct.description}</Text>
      <TouchableOpacity style={styles.addToCartButton} onPress={() => addToCart(selectedProduct)}>
        <Text style={styles.addToCartButtonText}>Add to Cart</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      {screen === 'Home' ? (
        <ScrollView>
          <View style={styles.header}>
            <TouchableOpacity onPress={() => setScreen('Drawer')}>
              <Image source={require('./images/Menu.png')} style={styles.menu} />
            </TouchableOpacity>
            <Image source={require('./images/Logo.png')} style={styles.logo} />
            <View style={styles.headerIcons}>
              <Image source={require('./images/Search.png')} style={styles.icon} />
              <TouchableOpacity onPress={() => setScreen('Cart')}>
                <Image source={require('./images/shoppingBag.png')} style={styles.icon} />
              </TouchableOpacity>
            </View>
          </View>
          <View style={styles.subHeader}>
            <Text style={styles.storyText}>OUR STORY</Text>
            <View style={styles.subHeaderIcons}>
              <View style={styles.roundIconContainer}>
                <Image source={require('./images/Listview.png')} style={styles.roundIcon} />
              </View>
              <View style={styles.roundIconContainer}>
                <Image source={require('./images/Filter.png')} style={styles.roundIcon} />
              </View>
            </View>
          </View>
          <View style={styles.productGrid}>
            <FlatList
              data={products}
              numColumns={2}
              keyExtractor={(item) => item.id.toString()}
              renderItem={renderProduct}
            />
          </View>
          <TouchableOpacity style={styles.viewCartButton} onPress={() => setScreen('Cart')}>
            <Text style={styles.viewCartButtonText}>View Cart</Text>
          </TouchableOpacity>
        </ScrollView>
      ) : screen === 'Cart' ? (
        <ScrollView>
          <View style={styles.header}>
            <TouchableOpacity onPress={() => setScreen('Home')}>
              <Image source={require('./images/navigate.png')} style={styles.icon} />
            </TouchableOpacity>
            <Image source={require('./images/Logo.png')} style={styles.logo} />
            <Image source={require('./images/Search.png')} style={styles.icon} />
          </View>
          <Text style={styles.checkoutText}>CHECKOUT</Text>
          <View style={styles.line} />
          <FlatList
            data={cart}
            keyExtractor={(item) => item.id.toString()}
            renderItem={renderCartItem}
          />
          <View style={styles.footer}>
            <Text style={styles.estimatedTotalText}>Est. Total</Text>
            <Text style={styles.totalPriceText}>${cart.reduce((sum, item) => sum + item.price, 0)}</Text>
          </View>
          <TouchableOpacity style={styles.checkoutButton}>
            <Text style={styles.checkoutButtonText}>CHECKOUT</Text>
            <Image source={require('./images/shoppingBag.png')} style={styles.checkoutIcon} />
          </TouchableOpacity>
        </ScrollView>
      ) : screen === 'ProductDetail' ? (
        <ScrollView>
          <View style={styles.header}>
            <TouchableOpacity onPress={() => setScreen('Home')}>
              <Image source={require('./images/navigate.png')} style={styles.icon} />
            </TouchableOpacity>
            <Image source={require('./images/Logo.png')} style={styles.logo} />
            <Image source={require('./images/Search.png')} style={styles.icon} />
          </View>
          {renderProductDetail()}
        </ScrollView>
      ) : screen === 'Drawer' && (
        <View style={styles.drawerContainer}>
          {/* Drawer content goes here */}
          <TouchableOpacity onPress={() => setScreen('Home')}>
            <Text style={styles.drawerText}>Home</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => setScreen('Cart')}>
            <Text style={styles.drawerText}>Cart</Text>
          </TouchableOpacity>
          {/* Add more drawer items as needed */}
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  menu: {
    width: 30,
    height: 30,
    marginHorizontal: 8,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    marginTop: 50,
  },
  logo: {
    width: 150,
    height: 60,
    marginLeft: 30,
  },
  headerIcons: {
    flexDirection: 'row',
  },
  icon: {
    width: 30,
    height: 30,
    marginHorizontal: 8,
  },
  subHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
  },
  storyText: {
    fontSize: 30,
  },
  subHeaderIcons: {
    flexDirection: 'row',
  },
  roundIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
    marginHorizontal: 8,
  },
  roundIcon: {
    width: 20,
    height: 20,
  },
  productGrid: {
    padding: 16,
  },
  productWrapper: {
    flex: 1,
    padding: 8,
  },
  productImageContainer: {
    position: 'relative',
  },
  productImage: {
    width: '100%',
    height: 150,
    borderRadius: 8,
  },
  addIconContainer: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 4,
  },
  addIcon: {
    width: 30,
    height: 30,
  },
  cartCount: {
    position: 'absolute',
    top: -8,
    right: -8,
    backgroundColor: 'red',
    borderRadius: 10,
    paddingHorizontal: 6,
    paddingVertical: 2,
    color: '#fff',
    fontSize: 12,
  },
  categoryText: {
    fontSize: 12,
    color: '#888',
    marginTop: 8,
  },
  productName: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  productPrice: {
    fontSize: 14,
    color: '#888',
  },
  viewCartButton: {
    padding: 16,
    backgroundColor: '#000',
    alignItems: 'center',
    justifyContent: 'center',
    margin: 16,
    borderRadius: 8,
  },
  viewCartButtonText: {
    color: '#fff',
    fontSize: 16,
  },
  cartItemContainer: {
    flexDirection: 'row',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  cartItemImage: {
    width: 60,
    height: 60,
    borderRadius: 8,
  },
  cartItemDetails: {
    marginLeft: 16,
    flex: 1,
  },
  productText: {
    fontSize: 12,
    color: '#888',
  },
  removeIconContainer: {
    position: 'absolute',
    top: 8,
    right: 8,
  },
  removeIcon: {
    width: 20,
    height: 20,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  estimatedTotalText: {
    fontSize: 16,
  },
  totalPriceText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  checkoutButton: {
    padding: 16,
    backgroundColor: '#000',
    alignItems: 'center',
    justifyContent: 'center',
    margin: 16,
    borderRadius: 8,
    flexDirection: 'row',
  },
  checkoutButtonText: {
    color: '#fff',
    fontSize: 16,
    marginRight: 8,
  },
  checkoutIcon: {
    width: 20,
    height: 20,
  },
  productDetailContainer: {
    padding: 16,
  },
  detailImage: {
    width: '100%',
    height: 300,
    borderRadius: 8,
  },
  detailCategory: {
    fontSize: 12,
    color: '#888',
    marginTop: 8,
  },
  detailName: {
    fontSize: 24,
    fontWeight: 'bold',
    marginTop: 8,
  },
  detailPrice: {
    fontSize: 20,
    color: '#888',
    marginTop: 8,
  },
  detailDescription: {
    fontSize: 14,
    color: '#888',
    marginTop: 8,
  },
  addToCartButton: {
    padding: 16,
    backgroundColor: '#000',
    alignItems: 'center',
    justifyContent: 'center',
    margin: 16,
    borderRadius: 8,
  },
  addToCartButtonText: {
    color: '#fff',
    fontSize: 16,
  },
  drawerContainer: {
    flex: 1,
    padding: 16,
  },
  drawerText: {
    fontSize: 16,
    marginVertical: 8,
  },
});

export default App;

