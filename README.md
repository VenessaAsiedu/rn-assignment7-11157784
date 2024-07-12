# rn-assignment7-11157784
                                    Overview
This project allows users to browse products, view product details, and manage a shopping cart. The app fetches product data from an API and uses local storage to persist the shopping cart between sessions.

         Design Choices
         User Interface
Clean and Simple Layout: The app's UI is designed to be intuitive and user-friendly. Key screens include the Home screen for browsing products, the Cart screen for reviewing the shopping cart, the Product Detail screen for viewing detailed product information, and a Drawer for navigation.
Consistent Styling: A consistent style is maintained across the app using StyleSheet.create for defining styles.
Touchable Elements: Use of TouchableOpacity for interactive elements to provide feedback when users interact with the app.
         State Management
useState: Used for managing local state such as products, cart, selected product, and current screen.
useEffect: Used for side effects like fetching data from the API and loading cart data from local storage when the app mounts.
         Data Storage
AsyncStorage: Used for persisting the shopping cart data between sessions. When items are added or removed from the cart, the cart is updated in AsyncStorage.
Implementation Details
         API Integration
The app fetches product data from an external API using axios.
Products are stored in the products state and displayed in a grid layout using FlatList.
         Cart Management
Products can be added to and removed from the cart. The cart state is updated accordingly.
The cart is stored in AsyncStorage to persist data between app sessions.
addToCart and removeFromCart functions handle updating the cart state and AsyncStorage.
         Screen Navigation
The app uses a single state variable screen to manage which screen is currently displayed.
Conditional rendering based on the value of screen determines which component is shown.
        Screenshots
