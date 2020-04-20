import React from 'react';
import { View, Text, Button, StyleSheet, AsyncStorage } from 'react-native';
import auth from '@react-native-firebase/auth';
import { GoogleSignin } from '@react-native-community/google-signin';

async function onGoogleButtonPress() {
    // Get the users ID token
    const { idToken } = await GoogleSignin.signIn();
  
    // Create a Google credential with the token
    const googleCredential = auth.GoogleAuthProvider.credential(idToken);
  
    // Sign-in the user with the credential
    return auth().signInWithCredential(googleCredential);
  }

class LoginScreen extends React.Component {
    static navigationOptions = {
        title: 'Please sign in',
    };

    render() {
        return (
            <View style={styles.view}>
                <Button title="Sign in with Google" onPress={this._signInAsync} />
            </View>
        );
    }

    _signInAsync = async () => {
        onGoogleButtonPress().then(() => console.log('Signed in with Google!'));
        //this.props.navigation.navigate('Chatrooms');
        /*auth()
            .signInAnonymously()
            .then(() => {
                console.log('User signed in anonymously');
            })
            .catch(error => {
                if (error.code === 'auth/operation-not-allowed') {
                console.log('Enable anonymous in your firebase console.');
                }

                console.error(error);
            });*/
    };
}    

const styles = StyleSheet.create({
    view: {
        flex: 1, 
        alignItems: 'center', 
        justifyContent: 'center'
    },
    text: {
    },
});

export default LoginScreen;


