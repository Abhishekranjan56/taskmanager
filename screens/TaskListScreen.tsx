import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import {storage} from '../storage/index';
import { StackNavigationProp } from '@react-navigation/stack';
import { RouteProp } from '@react-navigation/native';
import { Task } from '../types';
import { RootStackParamList } from '../navigation/TaskStackNavigator';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

type TaskListScreenProps = {
  navigation: StackNavigationProp<RootStackParamList, 'Tasks'>;
  route: RouteProp<RootStackParamList, 'Tasks'>;
};

const TaskListScreen: React.FC<TaskListScreenProps> = ({ navigation }) => {
  const [tasks, setTasks] = useState<Task[]>([]);

  useEffect(() => {
    const loadTasks = () => {
      const savedTasks = storage.getString('tasks');
      if (savedTasks) {
        setTasks(JSON.parse(savedTasks));
      }
    };

    loadTasks();

    const listener = storage.addOnValueChangedListener((changedKey) => {
      if (changedKey === 'tasks') {
        loadTasks();
      }
    });

    return () => {
      listener.remove();
    };
  }, []);

  const renderItem = ({ item }: { item: Task }) => (
    <TouchableOpacity onPress={() => navigation.navigate('TaskDetails', { task: item })}>
      <View style={styles.taskItem}>
        <View style={styles.taskHeader}>
          <Text style={styles.taskTitle}>{item.title}</Text>
          <Icon name={item.status === 'done' ? 'check-decagram' : 'clock-alert-outline'} size={22} color={item.status === 'done' ? 'green' : '#fbbf24'} />
        </View>
        <Text style={styles.taskDescription}>{item.description}</Text>
        <View style={styles.taskFooter}>
          <Icon name="calendar-remove-outline" size={16} color="#dc2626" />
          <Text style={styles.taskDueDate}>{new Date(item.dueDate).toLocaleDateString()}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <FlatList data={tasks} renderItem={renderItem} keyExtractor={(item) => item.id} />
      <TouchableOpacity style={styles.addButton} onPress={() => navigation.navigate('TaskCreation')}>
        <Icon name="plus" size={24} color="white" />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  taskItem: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  taskHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  taskTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  taskDescription: {
    color: '#999',
    marginTop: 5,
  },
  taskFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
  },
  taskDueDate: {
    marginLeft: 5,
    color: '#999',
  },
  addButton: {
    backgroundColor: '#6200EE',
    padding: 15,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'absolute',
    right: 20,
    bottom: 20,
    width: 60,
    height: 60,
  },
});

export default TaskListScreen;
