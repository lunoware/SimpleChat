// React
import React from 'react';
import {
  View,
  Text,
  Button,
  FlatList,
  StyleSheet,
  TextInput,
  KeyboardAvoidingView,
  ScrollView,
} from 'react-native';

// Firebase
import auth from '@react-native-firebase/auth';
import database from '@react-native-firebase/database';

// Fix for avoid keyboard with header issue
import { HeaderHeightContext } from "@react-navigation/stack";

import ChatMessageListItem from '../Components/ChatMessageListItem';

import moment from "moment";

class ChatRoomScreen extends React.Component {

    constructor(props){
        super(props);
        this.state = {
            messages: "",
            message: "",
            currentUser: auth().currentUser
        }

        console.log(auth().currentUser);
    }

    componentDidMount(){
        const chatRoomId = this.props.route.params.chatRoomId;
        database()
        .ref('chatrooms/'+chatRoomId+'/messages')
        .orderByChild('createdTimestamp')
        .limitToLast(50)
        .on('value', snapshot => {

            const messages = [];            
            snapshot.forEach(object => {
                const message = {
                    key: object.key,
                    message: object.val().message,
                    createdBy: object.val().createdBy,
                    avatarUrl: object.val().avatarUrl,
                    displayName: object.val().displayName,
                    createdTimestamp: object.val().createdTimestamp
                }
                messages.push(message);
            });

            this.setState({ messages: messages.reverse()});
        });
    }
/*
    a. Avatar of sender 
    b. Name of sender 
    c. Message date
    d. Message text
*/


    sendMessage(){
        console.log("sending message",this.state.message);

        const chatRoomId = this.props.route.params.chatRoomId;

        const newReference = database()
        .ref('chatrooms/'+chatRoomId+"/messages")
        .push();

        newReference
        .set({
            createdBy: this.state.currentUser.uid,
            message: this.state.message,
            createdTimestamp: database.ServerValue.TIMESTAMP,
            avatarUrl: this.state.currentUser.photoURL,
            displayName: this.state.currentUser.displayName
        })
        .then(() => {
            console.log('Data updated.');
            this.setState({message: ""});
        });

    }

    render() {
        return (
            <HeaderHeightContext.Consumer>
            {headerHeight => (
                <KeyboardAvoidingView 
                    style={styles.keyboardAvoidingView} 
                    keyboardVerticalOffset={headerHeight} 
                    behavior="padding">
                    <View style={styles.chat}>
                        <FlatList
                            inverted
                            data={this.state.messages}
                            renderItem={({ item }) => <ChatMessageListItem 
                                                            message={item.message} 
                                                            displayName={item.displayName}
                                                            avatarUrl={item.avatarUrl} 
                                                            messageDate={moment(new Date(item.createdTimestamp)).format('MM/DD/YYYY hh:MM')}
                                                            myMessage={this.state.currentUser.uid == item.createdBy}
                                                        />}
                            keyExtractor={item => item.name}
                        />
                    </View>
                    <View style={styles.input}>
                        <TextInput 
                            placeholder="Type your message here" 
                            returnKeyType="send" 
                            style={styles.textInput}  
                            onSubmitEditing={() => this.sendMessage()}
                            onChangeText={text => this.setState({message: text})}
                            value={this.state.message}
                        />
                    </View>
                </KeyboardAvoidingView>
            )}
            </HeaderHeightContext.Consumer>
        );
    }
}

const styles = StyleSheet.create({
    keyboardAvoidingView: {
        flex: 1,
    },
    chat: {
        flex: 1,
    },
    input: {
        backgroundColor: "#3333EE",
        paddingTop: 20,
        paddingHorizontal: 15,
        paddingBottom: 25
    },
    textInput: {
        backgroundColor: "white",
        fontSize: 18,
        padding: 10,
        borderRadius: 10
    }
});

export default ChatRoomScreen;