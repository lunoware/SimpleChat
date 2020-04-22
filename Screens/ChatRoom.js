// React
import React from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  TextInput,
  KeyboardAvoidingView,
  ActivityIndicator
} from 'react-native';

// Firebase
import auth from '@react-native-firebase/auth';
import database from '@react-native-firebase/database';

// Fix for avoid keyboard with header issue
import { HeaderHeightContext } from "@react-navigation/stack";

// Components
import ChatMessageListItem from '../Components/ChatMessageListItem';

// Date/time formatting
import moment from "moment";

// Image picker
import ImagePicker from 'react-native-image-picker';

// Firebase storage
import { imagePickerOptions, uploadFileToFireBase } from '../utils';

// Number of messages to load bulk
const numberOfMessagesInBulk = 50;

class ChatRoomScreen extends React.Component {

    constructor(){
        super();
        this.state = {
            messages: "",
            message: "",
            currentUser: auth().currentUser,
            imageToUpload: null,
            numberOfMessages: numberOfMessagesInBulk
        }
    }

    componentDidMount(){

        // Get room id for current chat room
        const chatRoomId = this.props.route.params.chatRoomId;

        this.databaseRef = database()
        .ref('chatrooms/'+chatRoomId+'/messages');

        this.getMessages();
    }

    getMessages = () => {
        //Get last 50 messages from this room
        this.databaseRef.orderByChild('createdTimestamp')
        .limitToLast(this.state.numberOfMessages)
        .on('value', snapshot => {
            // Create array of messages to populate chat messages
            const messages = [];
            snapshot.forEach(object => {
                const message = {
                    key: object.key,
                    imageName: object.val().imageName,
                    message: object.val().message,
                    createdBy: object.val().createdBy,
                    avatarUrl: object.val().avatarUrl,
                    displayName: object.val().displayName,
                    createdTimestamp: object.val().createdTimestamp
                }
                messages.push(message);
            });

            // Reverse array so newest messages are placed last in array
            this.setState({ messages: messages.reverse()});
        });
    }

    // Select image 
    selectImage = () => {
        //ImagePicker.launchImageLibrary(imagePickerOptions, imagePickerResponse => {
        ImagePicker.showImagePicker(imagePickerOptions, imagePickerResponse => {
            const { didCancel, error } = imagePickerResponse;
            if (didCancel) {
                //alert('Post canceled');
            } else if (error) {
                alert('An error occurred: ', error);
            } else {
                // If image was succesfully selected add response to states
                this.setState({
                    imageToUpload: imagePickerResponse
                });
            }
        });
    }

    // Upload Image
    uploadImage = (fileName) => {
        this.setState({isUploading: true});
        Promise.resolve(uploadFileToFireBase(this.state.imageToUpload,fileName))
        .then(response => {
            console.log("image uploaded", response);
            // Remove imagePicker response after image was succesfully sent
            this.clearImage();
            this.setState({isUploading: false});
        });
    };

    // Send Message 
    sendMessage(){

        // Create file name for image (if the user added an image)
        const fileName = this.state.imageToUpload != null ? auth().currentUser.uid + "-" + new Date() : "";

        // Get current chat room id
        const chatRoomId = this.props.route.params.chatRoomId;

        // Create database reference to the messenges in this room
        const newReference = database()
        .ref('chatrooms/'+chatRoomId+"/messages")
        .push();

        // Add new message to list of messages
        newReference
        .set({
            createdBy: this.state.currentUser.uid,
            message: this.state.message,
            imageName: fileName,
            createdTimestamp: database.ServerValue.TIMESTAMP,
            avatarUrl: this.state.currentUser.photoURL,
            displayName: this.state.currentUser.displayName
        })
        .then(() => {
            console.log('Data updated.');
            // Clear message field
            this.setState({message: ""});

            // Start uploading image if user selected an image
            if(this.state.imageToUpload != null){
                this.uploadImage(fileName);
            }
        });
    }

    // Remove reference to selected image
    clearImage = () => {
        this.setState({
            imageToUpload: null
        });
    }

    // Increase number of loaded messages in chat
    increaseNumberOfMessages = () => {
        //increase number of messages number and update database reference
        this.setState({
            numberOfMessages: this.state.numberOfMessages+numberOfMessagesInBulk
        },() => this.getMessages());
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
                            onEndReached={this.increaseNumberOfMessages.bind(this)}
                            onEndReachedThreshold={0.1}
                            renderItem={({ item }) => <ChatMessageListItem 
                                                            message={item.message} 
                                                            imageName={item.imageName}
                                                            displayName={item.displayName}
                                                            avatarUrl={item.avatarUrl} 
                                                            messageDate={moment(new Date(item.createdTimestamp)).calendar()}
                                                            myMessage={this.state.currentUser.uid == item.createdBy}
                                                        />}
                            keyExtractor={item => item.key}
                        />
                    </View>
                    <View style={styles.inputContainer}>
                        {this.state.imageToUpload !== null ? 
                        <>
                            <TouchableOpacity onPress={this.clearImage}>
                                {this.state.isUploading ?
                                <ActivityIndicator color="#fff"></ActivityIndicator>
                                :
                                <Image
                                    source={ require('../src/images/close.png') }
                                    style={styles.removeImageIcon}
                                />
                                }
                            </TouchableOpacity>
                            <Image
                                source={{uri: this.state.imageToUpload.uri}}
                                style={styles.imagePreview}
                            />
                        </>
                        : null}
                        <View style={styles.inputs}>
                            <TextInput 
                                placeholder="Type your message here" 
                                returnKeyType="send" 
                                style={styles.textInput}  
                                onSubmitEditing={() => this.sendMessage()}
                                onChangeText={text => this.setState({message: text})}
                                value={this.state.message}
                            />
                            <TouchableOpacity style={styles.imageSelectInput} onPress={this.selectImage}>
                                <Image
                                    source={ require('../src/images/camera.png') }
                                    style={styles.cameraIcon}
                                />
                            </TouchableOpacity>
                        </View>
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
    inputContainer: {
        backgroundColor: "#3333EE",
        paddingTop: 20,
        paddingHorizontal: 15,
        paddingBottom: 25
    },
    inputs: {
        flexDirection: "row"
    },
    textInput: {
        backgroundColor: "white",
        fontSize: 18,
        paddingHorizontal: 10,
        paddingVertical: 10,
        borderRadius: 10,
        flex: 1,
        marginRight: 10
    },
    imageSelectInput: {
        backgroundColor: "white",
        borderRadius: 50,
        width: 50,
        height: 50,
        alignItems: "center",
        justifyContent: "center"
    },
    cameraIcon: {
        width: 30,
        height: 30
    },
    imagePreview: {
        width: 100,
        height: 100,
        marginVertical: 20,
        alignSelf: "center"
    },
    removeImageIcon: {
        color: "#fff",
        width: 30,
        height: 30
    }
});

export default ChatRoomScreen;