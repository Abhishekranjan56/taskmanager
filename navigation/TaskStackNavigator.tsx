import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import TaskListScreen from '../screens/TaskListScreen';
import TaskDetailsScreen from '../screens/TaskDetailsScreen';
import TaskCreationScreen from '../screens/TaskCreationScreen';
import { Task } from '../types';

export type RootStackParamList = {
  Tasks: undefined;
  TaskDetails: { task: Task };
  TaskCreation: undefined;
};

const Stack = createStackNavigator<RootStackParamList>();

const TaskStackNavigator = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Tasks" component={TaskListScreen} />
      <Stack.Screen name="TaskDetails" component={TaskDetailsScreen} />
      <Stack.Screen name="TaskCreation" component={TaskCreationScreen} />
    </Stack.Navigator>
  );
};

export default TaskStackNavigator;
