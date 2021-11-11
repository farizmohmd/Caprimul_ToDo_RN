import React,{useState} from 'react';
import {View,SafeAreaView,Text,TouchableOpacity,StyleSheet,Dimensions,TextInput,FlatList, Alert,Image} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons'
import Icon1 from 'react-native-vector-icons/Ionicons'
import AsyncStorage from '@react-native-async-storage/async-storage';
// import { useState } from 'react';
const Height = Dimensions.get('window').height;
const Width = Dimensions.get('window').width;

const App = () => {
  const [todos, setTodos] = React.useState([]);
  const [textInput, setTextInput] = React.useState('');
  
//   const [isEditing, setEdit] = useState(false);


  React.useEffect(() => {
    getTodosFromUserDevice();
  }, []);

  React.useEffect(() => {
    saveTodoToUserDevice(todos);
  }, [todos]);

  const addTodo = () => {
    if (textInput == '') {
      Alert.alert('Error', 'Please input something');
    } else {
      const newTodo = {
        id: Math.random(),
        task: textInput,
        completed: false,
      };
      setTodos([...todos, newTodo]);
      setTextInput('');
    }
  };

  const saveTodoToUserDevice = async todos => {
    try {
      const stringifyTodos = JSON.stringify(todos);
      await AsyncStorage.setItem('todos', stringifyTodos);
    } catch (error) {
      console.log(error);
    }
  };

  const getTodosFromUserDevice = async () => {
    try {
      const todos = await AsyncStorage.getItem('todos');
      if (todos != null) {
        setTodos(JSON.parse(todos));
      }
    } catch (error) {
      console.log(error);
    }
  };

  const markTodoComplete = todoId => {
    const newTodosItem = todos.map(item => {
      if (item.id == todoId) {
        return {...item, completed: true};
      }
      return item;
    });

    setTodos(newTodosItem);
  };

  const deleteTodo = todoId => {
    const newTodosItem = todos.filter(item => item.id != todoId);
    setTodos(newTodosItem);
  };

  const clearAllTodos = () => {
    Alert.alert('Confirm', 'Clear todos?', [
      {
        text: 'Yes',
        onPress: () => setTodos([]),
      },
      {
        text: 'No',
      },
    ]);
  };

  const ListItem = ({todo}) => {
    return (
      <View style={styles.flatList}>
        <View style={{flex: 1}}>
          <TextInput
            style={{
              fontWeight: 'bold',
              fontSize:Height*.03,
              textDecorationLine: todo?.completed ? 'line-through' : 'none',
            }}>
            {todo?.task}
          </TextInput>
        </View>
        {/* <TouchableOpacity>
            <Icon name="edit" size={Height*.04} />
        </TouchableOpacity> */}
        {!todo?.completed && (
          <TouchableOpacity onPress={() => markTodoComplete(todo.id)}>
             <View style={[styles.actionIcon, {backgroundColor: 'green'}]}>
              <Icon name="done" size={Height*.035} color="white" />
            </View>
          </TouchableOpacity>
        )}
        <TouchableOpacity onPress={() => deleteTodo(todo.id)}>
            <Icon name="delete" style={{marginLeft:Width*.03}} size={Height*.04} color="red" />
        </TouchableOpacity>
      </View>
    );
  };
  return (
    <SafeAreaView
      style={{flex: 1}}>
      <View style={styles.heading}>
          <Image source={require('./src/assets/caprimul_logo.png')} style={{height:Height*.05,width:Height*.045}} />
        <Text style={styles.headingText}>
          Caprimul To Do Demo
        </Text>
        <TouchableOpacity>
        <Icon name="delete" size={Height*.045} color="red" onPress={clearAllTodos} />
        </TouchableOpacity>
        
      </View>

      <FlatList
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{padding:Height*.02}}
        data={todos}
        renderItem={({item}) => <ListItem todo={item} />}
      />

      <View style={styles.bottom}>
        <View style={styles.inputView}>
          <TextInput
            value={textInput}
            placeholder="Shoot here"
            onChangeText={text => setTextInput(text)}
          />
        </View>

        <TouchableOpacity onPress={addTodo}>
                    <Icon name='add-circle' size={Height*.08} color={'#1d1d85'}/>

                </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({

    heading:{
        flexDirection:'row',
        alignItems:'center',
        justifyContent:'space-between',
        padding:Height*.03
    },
    headingText:{
        fontWeight:'bold',
        color:'black',
        fontSize:Height*.04
    },
    bottom:{
        position:'absolute',
        bottom:0,
        flex:1,
        justifyContent:'space-between',
        width:Width,
        flexDirection:'row',
        alignItems:'center',
        padding:Height*.01,
    },
    inputView:{
        flex:1,
        height:Height*.08,
        // backgroundColor:'green',
        borderRadius:Height*.02,
        borderWidth:1,
    },
    flatList:{
        padding: Height*.035,
        backgroundColor:'white',
        flexDirection: 'row',
        elevation: Height*.04,
        borderRadius: Height*.02,
        marginTop:Height*.03
    },
    actionIcon: {
        height:Height*.04,
        width:Height*.04,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'red',
        marginLeft:Width*.03,
        borderRadius:Height*.02,
    },
});

export default App;

