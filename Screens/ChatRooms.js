// React
import React from 'react';

// React Native
import {
  View,
  FlatList, 
  StyleSheet,
} from 'react-native';

// Firebase
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

// Set up event listener for notifications 
async function setupNotificationEventListeners(callback) {

    // When a notification is pressed in background get notification data and send to callback
    messaging().onNotificationOpenedApp(async remoteMessage => {
        const data = remoteMessage.data; 
        callback(data);
    });

    // When a notification is pressed while app is in quit state get notification data and send to callback
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
            // Is room data being loaded
            isFetching: false,

            // Array of chatroom data
            chatRooms: []
        }
    }

    componentDidMount(){

        // Database reference for chatrooms
        this.databaseRef = database()
        .ref('chatrooms');

        // Get room data
        this.getRooms();

        // Request permission to send notifications 
        requestUserPermission();

        // Setup notifcation listeners 
        setupNotificationEventListeners(notificationData => {
            // When user presses notification get the room id redirect to that room
            this.enterChatRoom(notificationData.roomId)
        });
    }

    // Get room data
    getRooms = () => {

        // Get all room data once
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
    
            // Add chat room data to state and stop activity indicator
            this.setState({ chatRooms: chatRooms, isFetching: false });
        });
    }

    // Takes id of a chat room and navigates to that room
    enterChatRoom(id){
        this.props.navigation.navigate("Chatroom", {chatRoomId: id});
    }

    // Refresh chat rooms data
    onRefresh() {
        // Start activity indicator and start getting chat rooms data
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