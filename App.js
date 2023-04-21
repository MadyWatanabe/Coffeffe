import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, Linking, Pressable, TouchableOpacity, Image,TextInput, Alert, LogBox} from 'react-native';
import React, { useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import {Picker} from '@react-native-picker/picker';
// Picker for the payment screen needed to run the following in cmd: npm install @react-native-picker/picker --save

LogBox.ignoreLogs(['Non-serializable values were found in the navigation state',]);
import * as SplashScreen from 'expo-splash-screen';
SplashScreen.preventAutoHideAsync();
setTimeout(SplashScreen.hideAsync, 2000);

function Welcome({ navigation }) {
  const phoneNumber = '(402)555-5555'
  // "tel:", tells the device to open the phone dialer app when the link is clicked.
  const phoneLink = `tel:${phoneNumber}`;
  const chocolateLink = 'https://lulubeechocolates.com/';

  const handleChocolatePress = () => {
    Linking.openURL(chocolateLink);
  };

  return (
    <View style={styles.container}>
      <Text>Welcome to Coffeffe Coffee House! Where coffee drinkers drink coffee.</Text>
      <Text style={styles.welcomeHeader}>Location:</Text>
      <Text style={styles.wellcomeInfo}>444 O Street Eagle, Ne. 68347</Text>
      <Text style={styles.welcomeHeader}>Hours of Operation: </Text>
      <Text style={styles.wellcomeInfo}>Monday - Saturday 6am - 6pm</Text>
      <Text style={styles.welcomeHeader}>Phone Number:</Text>
      {/* The Text component displaying the phone number has an onPress event that calls 
      Linking.openURL(phoneLink), which opens the phone dialer app with the phone 
      number pre-populated. */}
      <Text style={styles.dialLink} onPress={() => Linking.openURL(phoneLink)}>{phoneNumber}</Text>
 {/* Link to an external site */}
       {/* The TouchableOpacity component with an onPress event that calls handleChocolatePress() 
       function that calls Linking.openURL() with the chocolateLink variable when the user 
       presses the <TouchableOpacity> component.*/}
       <TouchableOpacity onPress={handleChocolatePress}>
        <Text style={styles.welcomeHeader}>Are You a Chocolate Lover?</Text>
        <Text style={styles.wellcomeInfo}>Check out our partners at Lulubee Chocolates in Lincoln, NE!</Text>

        <Text style={styles.dialLink}>Lulubee Chocolate Company</Text>
      </TouchableOpacity>
{/* Image other than the icon or splashScreen */}
      <Image style={styles.image}source={require('./assets/coffee.png')} />
      <View style={styles.buttonContainer}>
        <Pressable style={styles.button} onPress={() => navigation.navigate('MenuScreen')}>
          <Text style={styles.buttonText}>Start Order</Text>
        </Pressable>
      </View>

      <StatusBar style="auto" />
    </View>
  );
}

function MenuScreen({navigation}){
  const [name, setName] = useState('');
  const [order, setOrder] = useState([]);

  // the user will be required to add their name to their order before continuing
  // otherwise when the item is selected an alert will display letting them know 
  // that the item was successfully added to their order!

  {/* The addToOrder function updates the order state by adding the new drink object to the 
existing array of orders using the spread operator. */}
  const addToOrder = (item) => {
    if (name.length < 2) {
      Alert.alert('Hey Friend', 'Please enter a name to begin your order');
    } else {
      setOrder([...order, item]);
      Alert.alert('Sounds Good', `${item.name} has been added to your order`);
    }
  };
  // first define a menuItems constant that is an array of objects representing each drink
  //  and its price. We then use the map function to iterate over this array and display 
  //  each drink's name and price. 
  const menuItems = [
    {
      id: 1,
      name: "Espresso",
      price: 2.5
    },
    {
      id: 2,
      name: "Americano",
      price: 3.0
    },
    {
      id: 3,
      name: "Latte",
      price: 4.0
    },
    {
      id: 4,
      name: "Cappuccino",
      price: 3.5
    },
    {
      id: 5,
      name: "Regular Coffee",
      price: 1.5
    },
    {
      id: 6,
      name: "Decaf Coffee",
      price: 1.5
    },
    {
      id: 7,
      name: "Macchiatto",
      price: 4.75
    },
    {
      id: 8,
      name: "Flat White",
      price: 4.5
    },
    {
      id: 9,
      name: "Irish Coffee",
      price: 5.25
    },
    {
      id: 10,
      name: "Red Eye",
      price: 3.75
    },
    {
      id: 11,
      name: "Cafe au Lait",
      price: 5.5
    }
  ];

// Determine whether the "View Order" button should be disabled
const isOrderEmpty = order.length === 0;

return (
  <View style={styles.container}>
    <TextInput style={styles.textInput}
      placeholder="Enter Your Name To Start Your Order"
      onChangeText={newName => setName(newName)}
      defaultValue={name}
    />

    {menuItems.map((item, index) => {
      return (
        <View key={index}>
          <View style={styles.menuItem}>
            <Text style={styles.itemName}>{item.name}</Text>
            <Text style={styles.itemPrice}>${item.price.toFixed(2)}</Text>
{/* this button calls the addToOrder function with the corresponding drink object as an argument. */}         
            <Pressable style={styles.menuButton} onPress={() => addToOrder(item)}>
              <Text style={styles.buttonText}>Add to Order</Text>
              <View style={styles.separator} />
            </Pressable>
          </View>
 {/* Had to code it this way to see the seperator between menu items */} 
          <View style={styles.separator} />
        </View>
      )
    })}

    {/* Disable the "View Order" button if the order is empty */}
    {/* pass the order state as a parameter to the ConfirmOrder screen along with the name state
    and setOrder, this will be needed to remove an unwanted item from the order. */}
    <View style={styles.buttonContainer}>
      <Pressable
        style={[styles.button, isOrderEmpty && styles.disabledButton]}
        onPress={() => navigation.navigate('ConfirmOrder',{ name, order, setOrder})}
        disabled={isOrderEmpty}>
        <Text style={styles.buttonText}>Checkout</Text>
      </Pressable>
    </View>
  </View>
);
}


function ConfirmOrder({route, navigation}){
  // in this case 'name' refers to the name that was entered in the text box on the
  // previous screen
  const { name, order, setOrder } = route.params;
  const salesTaxRate = 0.07;
  // calculate the subtotal, sales tax, and total due by iterating over the order array 
  // with the reduce method Page 474 murach's JavaScript and jQuery.
  let subtotal = order.reduce((total, item) => total + item.price, 0);
  let salesTax = subtotal * salesTaxRate;
  let totalDue = subtotal + salesTax;


  // removeItem that takes the unique identifier of the item to be removed as a parameter, 
  // and updates the order state to remove that item.
  function removeItem(itemId) {
    const orders = order.filter(item => item.id !== itemId);
    subtotal = orders.reduce((total, item) => total + item.price, 0);
    salesTax = subtotal * salesTaxRate;
    totalDue = subtotal + salesTax;
    setOrder(orders);
  }

  return (
    <View style={styles.container}>
      <Text>Nice {name}! Does your order look correct?</Text>
      <Text style={styles.itemName}>Order Summary:</Text>
      <Text></Text>
      
      {order.map((item, index) => (
  <View style={styles.menuItem} key={index}>
    <Text style={styles.itemName}>{item.name}</Text>
    <Text style={styles.itemPrice}>${item.price.toFixed(2)}</Text>
    <Pressable style={styles.menuButton} onPress={() => removeItem(item.id)}>
      <Text style={styles.buttonText}>Remove</Text>
      <View style={styles.separator} />
    </Pressable>
    
  </View>
))}
{/* Had to do it this way so the order was seperated from the totals       */}
      <View style={styles.separator}></View>
      <Text></Text>

      <View>
        <Text style={styles.subtotalText}>Subtotal:</Text>
        <Text style={styles.subtotalPrice}>${subtotal.toFixed(2)}</Text>
      
        <Text style={styles.salesTaxText}>Sales Tax ({(salesTaxRate * 100).toFixed(0)}%):</Text>
        <Text style={styles.salesTaxPrice}>${salesTax.toFixed(2)}</Text>

        <Text style={styles.totalDueText}>Total Due:</Text>
        <Text style={styles.totalDuePrice}>${totalDue.toFixed(2)}</Text>
      </View>

      <View style={styles.buttonContainer}>
        <Pressable
          style={styles.leftButton}
          onPress={() => navigation.navigate('MenuScreen')}>
          <Text style={styles.buttonText}>Continue Shopping</Text>
        </Pressable>
        <Pressable
          style={styles.rightButton}
          onPress={() => navigation.navigate('Payment')}>
          <Text style={styles.buttonText}>Checkout</Text>
        </Pressable>
      </View>
    </View>
  );
}


function Payment({navigation}){
  const [selectedValue, setSelectedValue] = useState("visa");
  const [nameOnCard, setNameOnCard] = useState('');
  const [expirationDate, setExpirationDate] = useState('');
  const [cvv2, setCvv2] = useState('');
  const [cardNumber, setCardNumber] = useState('');

  // the isButtonDisabled variable is used to determine whether the button should be disabled or not. 
  // The variable is set to true if any of the required fields are empty or if the card number 
  // has not yet had all 16 digits entered.
  const isButtonDisabled = !(nameOnCard && expirationDate && cvv2 && cardNumber.length === 16);

  return (
    <View style={styles.container}>
      <Text>Please Select Your Card Type:</Text>
      <View style={styles.dropdownContainer}>
        <Picker
          selectedValue={selectedValue}
          onValueChange={(itemValue, itemIndex) => setSelectedValue(itemValue)}
          style={styles.dropdown}
        >
          <Picker.Item label="Visa" value="visa" />
          <Picker.Item label="Mastercard" value="mastercard" />
          <Picker.Item label="American Express" value="amex" />
          <Picker.Item label="Discover" value="discover" />
        </Picker>
      </View>

      <TextInput style={styles.textInput}
        placeholder="Enter your name as it appears on card"
        onChangeText={newNameOnCard => setNameOnCard(newNameOnCard)}
        defaultValue={nameOnCard}
      />

      <TextInput style={styles.textInput}
        placeholder="Expiration Date (MM/YY)"
        keyboardType='numeric'
        onChangeText={newExpirationDate => setExpirationDate(newExpirationDate)}
        defaultValue={expirationDate}
      />

      <TextInput style={styles.textInput}
        placeholder="CVV2"
        keyboardType='numeric'
        onChangeText={newCvv2 => setCvv2(newCvv2)}
        defaultValue={cvv2}
      />

      <TextInput style={styles.textInput}
        placeholder="Please enter your card number"
        keyboardType='numeric'
        onChangeText={newCardNumber => setCardNumber(newCardNumber)}
        defaultValue={cardNumber}
      />

{/* The disabled prop of the Pressable component is set to isButtonDisabled, 
and the styles.disabledButton style is applied to the button if it is disabled. */}
      <View style={styles.buttonContainer}>
        <Pressable
          style={[styles.button, isButtonDisabled && styles.disabledButton]}
          disabled={isButtonDisabled}
          onPress={() => navigation.navigate('Home')}
        >
          <Text style={styles.buttonText}>place Order</Text>
        </Pressable>
      </View>
    </View>
  );
}


const Stack = createNativeStackNavigator();
function App() {
  
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Home">
         {/* The options will show the text component at the top of the screen */}
        <Stack.Screen name="Home" 
              component={Welcome} options={{ title: 'Coffeffe Coffee House' ,headerStyle: {
                backgroundColor: '#823b07',},headerTintColor: '#fff9e7', }} />
        <Stack.Screen name="MenuScreen" component={MenuScreen} options={{ title: 'Menu' ,headerStyle: {
                backgroundColor: '#823b07',},headerTintColor: '#fff9e7', }} />
       <Stack.Screen name="ConfirmOrder" component={ConfirmOrder} options={{ title: 'Confirm Order' ,headerStyle: {
                backgroundColor: '#823b07',},headerTintColor: '#fff9e7', }} />
        <Stack.Screen name="Payment" component={Payment} options={{ title: 'Payment' ,headerStyle: {
                backgroundColor: '#823b07',},headerTintColor: '#fff9e7', }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff9e7',
  },
  welcomeHeader:{
    fontWeight: 'bold',
    fontSize: 18,
    marginTop: 10,
    marginLeft: 10,
  },
  wellcomeInfo:{
    fontSize: 16,
    marginLeft: 18,
    marginBottom: 28,
  },
  dialLink:{
    fontSize: 16,
    marginLeft: 18,
    marginBottom: 18,
    color:'blue',
  },
  buttonContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    alignItems: 'center',
  },
  button:{
    alignItems: 'center',
    backgroundColor: '#ceeafb',
    paddingHorizontal: 10,
    paddingVertical: 10,
    marginHorizontal: 70,
  },
  menuButton:{
    alignItems:'flex-end',
    backgroundColor: '#ceeafb',
    paddingHorizontal: 10, 
  },
  buttonText:{
    color:'purple',
    fontSize: 18,
  },
  image:{
    width: 250,
    height:250,
    marginHorizontal:80,
  },
  textInput: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    margin: 10,
    paddingHorizontal: 45,
    marginHorizontal: 30,
  },
  menuItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginHorizontal: 10,
    marginVertical: 5,
  },
  itemName: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  itemPrice: {
    fontSize: 16,
    color: '#777',
  },
  separator: {
    borderBottomColor: '#777',
    borderBottomWidth: StyleSheet.hairlineWidth,
    marginHorizontal: 10,
  },
  disabledButton: {
    backgroundColor: '#cccccc',
    opacity: 0.5
  },
  dropdownContainer: {
    borderWidth: 1,
    borderColor: '#888',
    borderRadius: 4,
    paddingHorizontal: 8,
    paddingVertical: 4,
    marginVertical: 16,
    marginRight: 190,
    marginLeft: 20,
  },
  dropdown: {
    width: 200,
    height: 32,
  },
  leftButton: {
    backgroundColor: '#ceeafb',
    borderRadius: 3,
    padding: 10,
    position: 'absolute',
    bottom: 20,
    left: 20,
    marginRight: 20,
    
  },
  rightButton: {
    backgroundColor: '#ceeafb',
    borderRadius: 3,
    padding: 10,
    position: 'absolute',
    bottom: 20,
    right: 20,
  },
  
});
export default App;