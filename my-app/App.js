import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { FlatList, Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const API_URL = 'https://fakestoreapi.com/products';

import backwardIcon from 'my-app\assets\Backward.png';
import closeIcon from 'my-app\assets\Close.png';
import doNotBleachIcon from 'my-app\assets\Do Not Bleach.png';
import doNotWashIcon from './images/do_not_wash.png';
import doorToDoorIcon from './images/door_to_door.png';
import downIcon from './images/down.png';

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
              <Image source={backwardIcon} style={styles.icon} />
            </TouchableOpacity>
            <Image source={require('./images/Logo.png')} style={styles.logo} />
            <Image source={require('./images/Search.png')} style={styles.icon} />
          </View>
          <Text style={styles.checkoutText}>CHECKOUT</Text>
          <FlatList
            data={cart}
            keyExtractor={(item) => item.id.toString()}
            renderItem={renderCartItem}
          />
          <TouchableOpacity style={styles.viewCartButton} onPress={() => setScreen('Home')}>
            <Text style={styles.viewCartButtonText}>Back to Home</Text>
          </TouchableOpacity>
        </ScrollView>
      ) : screen === 'ProductDetail' ? (
        <ScrollView>
          <View style={styles.header}>
            <TouchableOpacity onPress={() => setScreen('Home')}>
              <Image source={backwardIcon} style={styles.icon} />
            </TouchableOpacity>
            <Image source={require('./images/Logo.png')} style={styles.logo} />
            <Image source={require('./images/Search.png')} style={styles.icon} />
          </View>
          {renderProductDetail()}
        </ScrollView>
      ) : screen === 'Drawer' ? (
        <View style={styles.drawer}>
          <View style={styles.header}>
            <TouchableOpacity onPress={() => setScreen('Home')}>
              <Image source={closeIcon} style={styles.icon} />
            </TouchableOpacity>
            <Image source={require('./images/Logo.png')} style={styles.logo} />
            <Image source={require('./images/Search.png')} style={styles.icon} />
          </View>
          <Text style={styles.drawerText}>Drawer Content Here</Text>
          <View style={styles.iconList}>
            <Image source={doNotBleachIcon} style={styles.listIcon} />
            <Image source={downIcon} style={styles.listIcon} />
            <Image source={doNotWashIcon} style={styles.listIcon} />
            <Image source={doorToDoorIcon} style={styles.listIcon} />
          </View>
        </View>
      ) : null}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  logo: {
    width: 100,
    height: 40,
    resizeMode: 'contain',
  },
  icon: {
    width: 30,
    height: 30,
    marginHorizontal: 8,
  },
  productWrapper: {
    flex: 1,
    margin: 10,
    backgroundColor: '#f9f9f9',
    borderRadius: 10,
    padding: 10,
    alignItems: 'center',
  },
  productImageContainer: {
    position: 'relative',
    width: '100%',
    alignItems: 'center',
  },
  productImage: {
    width: 100,
    height: 100,
    resizeMode: 'contain',
  },
  addIconContainer: {
    position: 'absolute',
    bottom: -15,
    right: -10,
  },
  addIcon: {
    width: 30,
    height: 30,
  },
  cartCount: {
    position: 'absolute',
    bottom: -5,
    right: -5,
    backgroundColor: 'red',
    color: 'white',
    borderRadius: 10,
    padding: 5,
    fontSize: 12,
  },
  categoryText: {
    fontSize: 14,
    color: '#888',
    marginVertical: 5,
  },
  productName: {
    fontSize: 16,
    fontWeight: 'bold',
    marginVertical: 5,
  },
  productPrice: {
    fontSize: 14,
    color: '#000',
  },
  subHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 10,
  },
  storyText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  subHeaderIcons: {
    flexDirection: 'row',
  },
  roundIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#eee',
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 5,
  },
  roundIcon: {
    width: 24,
    height: 24,
  },
  productGrid: {
    padding: 10,
  },
  viewCartButton: {
    backgroundColor: '#000',
    padding: 15,
    alignItems: 'center',
    margin: 10,
    borderRadius: 10,
  },
  viewCartButtonText: {
    color: '#fff',
    fontSize: 16,
  },
  checkoutText: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    marginVertical: 10,
  },
  cartItemContainer: {
    flexDirection: 'row',
    padding: 10,
    alignItems: 'center',
  },
  cartItemImage: {
    width: 80,
    height: 80,
    resizeMode: 'contain',
  },
  cartItemDetails: {
    flex: 1,
    marginLeft: 10,
  },
  productText: {
    fontSize: 14,
    color: '#888',
  },
  removeIconContainer: {
    position: 'absolute',
    top: 5,
    right: 5,
  },
  removeIcon: {
    width: 24,
    height: 24,
  },
  productDetailContainer: {
    padding: 20,
    alignItems: 'center',
  },
  detailImage: {
    width: 200,
    height: 200,
    resizeMode: 'contain',
  },
  detailCategory: {
    fontSize: 14,
    color: '#888',
    marginVertical: 5,
  },
  detailName: {
    fontSize: 18,
    fontWeight: 'bold',
    marginVertical: 5,
  },
  detailPrice: {
    fontSize: 16,
    color: '#000',
    marginVertical: 5,
  },
  detailDescription: {
    fontSize: 14,
    color: '#666',
    marginVertical: 10,
    textAlign: 'center',
  },
  addToCartButton: {
    backgroundColor: '#000',
    padding: 15,
    borderRadius: 10,
    marginVertical: 10,
  },
  addToCartButtonText: {
    color: '#fff',
    fontSize: 16,
  },
  drawer: {
    padding: 20,
    alignItems: 'center',
  },
  drawerText: {
    fontSize: 18,
    fontWeight: 'bold',
    marginVertical: 20,
  },
  iconList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
  },
  listIcon: {
    width: 40,
    height: 40,
    margin: 8,
  },
});

export default App;
