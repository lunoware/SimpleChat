import React, {useState} from 'react';
import { Text, TouchableOpacity, StyleSheet, Image, View } from 'react-native';
import storage from '@react-native-firebase/storage';

const ChatMessageListItem = (props) => {
    const [imageUrl, setImageUrl] = useState();

    const containerStyle = props.myMessage ? [styles.container, styles.myMessageContainer] : styles.container;
    const textStyle = props.myMessage ? styles.myMessageText : null;

    const avatarUrl = { uri: props.avatarUrl};
 
    if(props.imageName){
        const ref = storage().ref("uploads/"+props.imageName);
                ref.getDownloadURL().then(url => {setImageUrl(url)})
                .catch(e=>{console.log(e);});
    }

    return(
        <View>
            <Text style={styles.messageDate}>{props.messageDate}</Text>
            <View style={containerStyle}>
                <Image style={styles.avatar}
                    source={ avatarUrl.uri ? avatarUrl : require('../src/images/missing-avatar.png') }
                />
                <View style={styles.content}>
                    <Text style={[styles.displayName, textStyle]}>{props.displayName}</Text>
                    <Text style={[styles.message, textStyle]}>{props.message}</Text>
                    {imageUrl ? <Image resizeMode="contain" style={styles.image}
                        source={ {uri: imageUrl} }
                    /> : null}
                </View>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: "#e0e0e0",
        marginHorizontal: 20,
        marginVertical: 10,
        paddingVertical: 15,
        paddingHorizontal: 20,
        marginRight: 50,
        flexDirection: "row",
        borderTopLeftRadius: 15,
        borderTopRightRadius: 15,
        borderBottomLeftRadius: 0,
        borderBottomRightRadius: 15,
    },
    myMessageContainer: {
        marginLeft: 50,
        marginRight: 20,
        backgroundColor: "#3333EE",
        borderTopLeftRadius: 15,
        borderTopRightRadius: 15,
        borderBottomRightRadius: 0,
        borderBottomLeftRadius: 15
    },
    content: {
        flex: 1
    },
    displayName: {
        fontWeight: "bold"
    },
    message: {

    },
    messageDate: {
        color: "#909090",
        fontSize: 12,
        alignSelf: "center"
    },
    myMessageText: {
        color: "#fff"
    },
    avatar: {
        width: 40,
        height: 40,
        borderRadius: 20,
        marginRight: 15
    },
    image: {
        width: "100%",
        height: 200,
    }
});

export default ChatMessageListItem; 