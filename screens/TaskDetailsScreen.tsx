import React, { useCallback } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, KeyboardAvoidingView, Platform } from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RouteProp } from '@react-navigation/native';
import { Button as PaperButton, Provider } from 'react-native-paper';
import {storage} from '../storage/index';
import { Task } from '../types';
import { RootStackParamList } from '../navigation/TaskStackNavigator';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

type TaskDetailsScreenProps = {
  navigation: StackNavigationProp<RootStackParamList, 'TaskDetails'>;
  route: RouteProp<RootStackParamList, 'TaskDetails'>;
};

const TaskDetailsScreen: React.FC<TaskDetailsScreenProps> = ({ route, navigation }) => {
  const { task } = route.params;

  const deleteTask = async () => {
    const existingTasks = storage.getString('tasks');
    if (existingTasks) {
      const tasks = JSON.parse(existingTasks);
      const updatedTasks = tasks.filter((t: Task) => t.id !== task.id);
      storage.set('tasks', JSON.stringify(updatedTasks));
    }
    navigation.goBack();
  };

  const updateTaskStatus = async (status: string) => {
    const existingTasks = storage.getString('tasks');
    if (existingTasks) {
      const tasks = JSON.parse(existingTasks);
      const updatedTasks = tasks.map((t: Task) => t.id === task.id ? { ...t, status } : t);
      storage.set('tasks', JSON.stringify(updatedTasks));
    }
    navigation.goBack();
  };

  return (
    <Provider>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={80}
      >
        <ScrollView contentContainerStyle={styles.scrollContainer}>
          <View style={styles.container}>
            <Text style={styles.title}>{task.title}</Text>
            <Text style={styles.description}>{task.description}</Text>
            <View style={styles.dateContainer}>
              <Icon name="calendar-remove-outline" size={16} color="#dc2626" />
              <Text style={styles.dueDate}>{new Date(task.dueDate).toLocaleDateString()}</Text>
            </View>
            <View style={styles.buttonContainer}>
              <PaperButton mode="outlined" onPress={deleteTask} style={styles.button}>Delete Task</PaperButton>
              <PaperButton mode="contained" onPress={() => updateTaskStatus('done')} style={styles.button}>Mark as Done</PaperButton>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </Provider>
  );
};

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
  },
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#4A90E2',
  },
  description: {
    fontSize: 16,
    color: '#999',
    marginBottom: 20,
  },
  dateContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  dueDate: {
    marginLeft: 5,
    fontSize: 16,
    color: '#999',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  button: {
    flex: 1,
    margin: 5,
  },
});

export default TaskDetailsScreen;
