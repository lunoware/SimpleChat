// React
import React from 'react';
import {
  View,
  Text,
  Button,
  FlatList, 
} from 'react-native';

// Firebase
import auth from '@react-native-firebase/auth';
import database from '@react-native-firebase/database';

// Components
import ChatRoomListItem from '../Components/ChatRoomListItem'


class ChatRoomsScreen extends React.Component {

    constructor(){
        super();
        
        this.state = {
            chatRooms: {}
        }
    }

    componentDidMount(){
        database()
        .ref('chatrooms')
        .on('value', snapshot => {

            const chatRooms = [];

            snapshot.forEach(object => {
                
                const chatRoom = {
                    key: object.key,
                    name: object.val().name,
                    description: object.val().description,
                }

                chatRooms.push(chatRoom);
            });

            this.setState({ chatRooms: chatRooms});
        });
    }

    enterChatRoom(id){
        this.props.navigation.navigate("Chatroom", {chatRoomId: id});
    }
  
    render() {
        return (
        <View>
            <FlatList
                data={this.state.chatRooms}
                renderItem={({ item }) => <ChatRoomListItem name={item.name} description={item.description} onPress={() => this.enterChatRoom(item.key)} />}
                keyExtractor={item => item.name}
            />
            <Button onPress={() => this._signOut()} title="Sign out"></Button>
        </View>
        );
    }

    _signOut = async () => {
        auth().signOut().then(function() {
            console.log('Signed Out');
        }, function(error) {
            console.error('Sign Out Error', error);
        });
    };
}

export default ChatRoomsScreen;