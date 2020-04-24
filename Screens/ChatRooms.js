// React
import React from 'react';

// React Native
import {
  View,
  FlatList, 
  StyleSheet,
} from 'react-native';

// Firebase
import auth from '@react-native-firebase/auth';
import database from '@react-native-firebase/database';

// Components
import ChatRoomListItem from '../Components/ChatRoomListItem'

// Date/time formatting
import moment from "moment";

import messaging from '@react-native-firebase/messaging';

// To request user permission for notifications
async function requestUserPermission() {
  const settings = await messaging().requestPermission();

  if (settings) {
    console.log('Permission settings:', settings);
  }
}

// Set up event
async function setupNotificationEventListeners(callback) {
    messaging().onNotificationOpenedApp(async remoteMessage => {
        const data = remoteMessage.data; 
        callback(data);
    });

    messaging().getInitialNotification()
    .then((remoteMessage) => {
        if (remoteMessage) {
            const data = remoteMessage.data;
            callback(data);
        }
    });
}

class ChatRoomsScreen extends React.Component {

    constructor(){
        super();
        
        this.state = {
            isFetching: false,
            chatRooms: []
        }
    }

    componentDidMount(){
        this.databaseRef = database()
        .ref('chatrooms');
        this.getRooms();
        requestUserPermission();
        setupNotificationEventListeners(notificationData => this.enterChatRoom(notificationData.roomId));
    }

    getRooms = () => {

        this.databaseRef
        .once('value')
        .then(snapshot => {
    
            const chatRooms = [];
    
            snapshot.forEach(object => {
                const chatRoom = {
                    key: object.key,
                    name: object.val().name,
                    description: object.val().description,
                    lastModified: object.val().lastModified,
                }
                chatRooms.push(chatRoom);
            });
    
            this.setState({ chatRooms: chatRooms, isFetching: false });
        });
    }

    enterChatRoom(id){
        this.props.navigation.navigate("Chatroom", {chatRoomId: id});
    }

    onRefresh() {
        this.setState({ isFetching: true }, function() { this.getRooms() });
    }
  
    render() {
        return (
            <View style={styles.container}>
                <FlatList
                    style={styles.rooms}
                    data={this.state.chatRooms.sort((a, b) => a.lastModified < b.lastModified)}
                    onRefresh={() => this.onRefresh()}
                    refreshing={this.state.isFetching}
                    renderItem={({ item }) => <ChatRoomListItem 
                        name={item.name} 
                        description={item.description}
                        lastModified={moment(new Date(item.lastModified)).calendar()}
                        onPress={() => this.enterChatRoom(item.key)} 
                    />}
                    keyExtractor={item => item.key}
                />
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1
    },
    rooms: {
        flex: 1
    }
});

export default ChatRoomsScreen;