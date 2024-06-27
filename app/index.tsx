import 'react-native-gesture-handler';
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import TaskStackNavigator from '../navigation/TaskStackNavigator';

const App = () => {
  return (
    <NavigationContainer independent={true}>
      <TaskStackNavigator />
    </NavigationContainer>
  );
};

export default App;
