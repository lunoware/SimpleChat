import React from 'react';
import { Text, TouchableOpacity, StyleSheet, Image, View } from 'react-native';

const ChatRoomListItem = (props) => {
    return(
        <View style={styles.container}>
            <View style={styles.info}>
                <Text style={styles.nameLabel}>{props.name}</Text>
                <Text style={styles.descriptionLabel}>{props.description}</Text>
            </View>
            <Image style={styles.chevron}
                source={require('../src/images/chevron-right.png')}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        borderBottomColor: "black",
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
    }
});

export default ChatRoomListItem; 