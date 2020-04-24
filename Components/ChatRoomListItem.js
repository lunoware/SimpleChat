// React 
import React from 'react';

// React Native
import { Text, TouchableOpacity, StyleSheet, Image, View } from 'react-native';


const ChatRoomListItem = (props) => {
    return(
        <TouchableOpacity onPress={props.onPress} >
            <View style={styles.container}>
                <View style={styles.info}>
                    <Text style={styles.nameLabel}>{props.name}</Text>
                    <Text style={styles.descriptionLabel}>{props.description}</Text>
                    <Text style={styles.lastModifiedLabel}>{props.lastModified}</Text>
                </View>
                <Image style={styles.chevron}
                    source={require('../src/images/chevron-right.png')}
                />
            </View>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    container: {
        borderBottomColor: "#e0e0e0",
        borderBottomWidth: 1,
        paddingVertical: 20,
        paddingHorizontal: 20,
        flexDirection: "row",
    },
    info: {
        flex: 1
    },
    nameLabel: {
        fontSize: 18,
        fontWeight: "bold"
    },
    descriptionLabel: {
        fontSize: 18
    },
    chevron: {
        width: 20,
        height: 20,
        alignSelf: "center"
    },
    lastModifiedLabel: {
        color: "gray"
    }
});

export default ChatRoomListItem; 