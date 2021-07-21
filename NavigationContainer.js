import React from 'react'
import { enableScreens } from 'react-native-screens';
import { useSelector } from 'react-redux'
import Home from './screens/Home'
import SplashScreen from './screens/SplashScreen'
import SignIn from './screens/auth/SignIn'
import { createNativeStackNavigator } from 'react-native-screens/native-stack';
import { NavigationContainer } from '@react-navigation/native';
import colors from './constants/colors'

enableScreens();
const Stack = createNativeStackNavigator();

const NavContainer = props => {
  const { authenticated, loading } = useSelector(state => state.auth);
  if (loading) {
    return <SplashScreen />;
  }
  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerStyle: {
            backgroundColor: colors.spearmint
          },
          headerTintColor: colors.black,
          headerTitleStyle: {
            fontFamily: "georgia-bold"
          }
        }}
      >
        {authenticated ? (
          <Stack.Screen name="Home" component={Home} />
        ) : (
          <>
            <Stack.Screen name="Sign In" component={SignIn} />
            {/* <Stack.Screen name="SignUp" component={SignUpScreen} /> */}
            {/* <Stack.Screen name="ResetPassword" component={ResetPassword} /> */}
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  )
}

export default NavContainer;