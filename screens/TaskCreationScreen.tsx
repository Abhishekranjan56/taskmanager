import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, ScrollView, KeyboardAvoidingView, Platform } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import DocumentPicker from 'react-native-document-picker';
import { StackNavigationProp } from '@react-navigation/stack';
import { RouteProp } from '@react-navigation/native';
import { RootStackParamList } from '../navigation/TaskStackNavigator';
import { Button as PaperButton, Provider } from 'react-native-paper';
import {storage} from '../storage/index';

type TaskCreationScreenProps = {
  navigation: StackNavigationProp<RootStackParamList, 'TaskCreation'>;
  route: RouteProp<RootStackParamList, 'TaskCreation'>;
};

const TaskCreationScreen: React.FC<TaskCreationScreenProps> = ({ navigation }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [dueDate, setDueDate] = useState(new Date());
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [attachments, setAttachments] = useState<any>([]);
  const [showDueDatePicker, setShowDueDatePicker] = useState(false);
  const [showStartDatePicker, setShowStartDatePicker] = useState(false);
  const [showEndDatePicker, setShowEndDatePicker] = useState(false);

  const createTask = async () => {
    if (!title) {
      alert('Title is required');
      return;
    }

    const id = new Date().getTime().toString();
    const newTask = { id, title, description, dueDate: dueDate.toISOString(), startDate: startDate.toISOString(), endDate: endDate.toISOString(), status: 'todo', attachments };

    const existingTasks = storage.getString('tasks');
    const tasks = existingTasks ? JSON.parse(existingTasks) : [];
    tasks.push(newTask);

    storage.set('tasks', JSON.stringify(tasks));
    navigation.goBack();
  };

  const pickDocument = async () => {
    try {
      const results = await DocumentPicker.pickSingle({
        type: [DocumentPicker.types.allFiles],
      });
      setAttachments(results);
    } catch (err) {
      if (DocumentPicker.isCancel(err)) {
        console.log('User cancelled the picker');
      } else {
        throw err;
      }
    }
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
            <Text style={styles.header}>Create Task</Text>
            <TextInput
              style={styles.input}
              placeholder="Add Title"
              value={title}
              onChangeText={setTitle}
            />
            <Text style={styles.label}>Date</Text>
            <TouchableOpacity onPress={() => setShowDueDatePicker(true)} style={styles.datePickerButton}>
              <Text style={styles.datePickerText}>{dueDate ? dueDate.toDateString() : 'Pick a date'}</Text>
            </TouchableOpacity>
            {showDueDatePicker && (
              <DateTimePicker
                value={dueDate}
                mode="date"
                display="default"
                onChange={(event, selectedDate) => {
                  const currentDate = selectedDate || dueDate;
                  setShowDueDatePicker(false);
                  setDueDate(currentDate);
                }}
              />
            )}
            <Text style={styles.label}>Start</Text>
            <TouchableOpacity onPress={() => setShowStartDatePicker(true)} style={styles.datePickerButton}>
              <Text style={styles.datePickerText}>{startDate ? startDate.toDateString() : 'Pick a date'}</Text>
            </TouchableOpacity>
            {showStartDatePicker && (
              <DateTimePicker
                value={startDate}
                mode="date"
                display="default"
                onChange={(event, selectedDate) => {
                  const currentDate = selectedDate || startDate;
                  setShowStartDatePicker(false);
                  setStartDate(currentDate);
                }}
              />
            )}
            <Text style={styles.label}>End</Text>
            <TouchableOpacity onPress={() => setShowEndDatePicker(true)} style={styles.datePickerButton}>
              <Text style={styles.datePickerText}>{endDate ? endDate.toDateString() : 'Pick a date'}</Text>
            </TouchableOpacity>
            {showEndDatePicker && (
              <DateTimePicker
                value={endDate}
                mode="date"
                display="default"
                onChange={(event, selectedDate) => {
                  const currentDate = selectedDate || endDate;
                  setShowEndDatePicker(false);
                  setEndDate(currentDate);
                }}
              />
            )}
            <TextInput
              style={styles.textArea}
              placeholder="Task Details"
              value={description}
              onChangeText={setDescription}
              multiline
            />
            <Text style={styles.label}>Attachments</Text>
            <TouchableOpacity style={styles.attachmentBox} onPress={pickDocument}>
              <Text style={styles.attachmentText}>Drop files here or Browse</Text>
            </TouchableOpacity>
            <View style={styles.buttonContainer}>
              <PaperButton mode="outlined" onPress={() => navigation.goBack()} style={styles.button}>Cancel</PaperButton>
              <PaperButton mode="contained" onPress={createTask} style={styles.button}>Save</PaperButton>
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
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#4A90E2',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    marginBottom: 20,
    borderRadius: 5,
  },
  label: {
    fontSize: 16,
    marginBottom: 5,
  },
  datePickerButton: {
    padding: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    marginBottom: 20,
  },
  datePickerText: {
    fontSize: 16,
  },
  textArea: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    marginBottom: 20,
    borderRadius: 5,
    height: 100,
  },
  attachmentBox: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 20,
    borderRadius: 5,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  attachmentText: {
    color: '#4A90E2',
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

export default TaskCreationScreen;
