import React from 'react'
import { enableScreens } from 'react-native-screens';
import { useSelector } from 'react-redux'
import Home from './screens/Home'
import SplashScreen from './screens/SplashScreen'
import SignIn from './screens/auth/SignIn'
import SignUp from './screens/auth/SignUp'
import VerifyAccount from './screens/auth/VerifyAccount'
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
          headerTintColor: colors.text,
          headerTitleStyle: {
            fontFamily: "georgia-bold"
          }
        }}
      >
        {authenticated ? (
          <Stack.Screen name="Home" component={Home} />
        ) : (
          <>
            <Stack.Screen name="SignIn" component={SignIn} options={{ title: "Sign In" }} />
            <Stack.Screen name="SignUp" component={SignUp} options={{ title: "Sign Up" }} />
            <Stack.Screen name="VerifyAccount" component={VerifyAccount} options={{ title: "Verify Account" }} />

            {/* <Stack.Screen name="ResetPassword" component={ResetPassword} /> */}
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  )
}

export default NavContainer;