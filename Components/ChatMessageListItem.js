import React from 'react';
import { Text, TouchableOpacity, StyleSheet, Image, View } from 'react-native';

const ChatMessageListItem = (props) => {

    const containerStyle = props.myMessage ? [styles.container, styles.myMessage] : styles.container;

    return(
        <View style={containerStyle}>
            <Text style={styles.message}>{props.message}</Text>
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
        borderBottomRightRadius: 15
    },
    myMessage: {
        marginLeft: 50,
        marginRight: 20,
        backgroundColor: "#3333EE",
        borderTopLeftRadius: 15,
        borderTopRightRadius: 15,
        borderBottomRightRadius: 0,
        borderBottomLeftRadius: 15
    },
    message: {

    }
});

export default ChatMessageListItem; 