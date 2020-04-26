// React
import React from 'react';

// React Native
import { 
    View, 
    Text, 
    StyleSheet, 
    ActivityIndicator,
    Alert,
    TouchableOpacity,
    Animated
} from 'react-native';

// Firebase
import auth from '@react-native-firebase/auth';
import { GoogleSignin } from '@react-native-community/google-signin';
import { LoginManager, AccessToken } from 'react-native-fbsdk';

async function onGoogleButtonPress() {
    // Get the users ID token
    const { idToken } = await GoogleSignin.signIn();

    // Create a Google credential with the token
    const googleCredential = auth.GoogleAuthProvider.credential(idToken);
  
    // Sign-in the user with the credential
    return auth().signInWithCredential(googleCredential);
}

async function onFacebookButtonPress() {
    // Attempt login with permissions
    const result = await LoginManager.logInWithPermissions(['public_profile', 'email']);

    if (result.isCancelled) {
        throw 'User cancelled the login process';
    }

    // Once signed in, get the users AccesToken
    const data = await AccessToken.getCurrentAccessToken();

    if (!data) {
        throw 'Something went wrong obtaining access token';
    }

    // Create a Firebase credential with the AccessToken
    const facebookCredential = auth.FacebookAuthProvider.credential(data.accessToken);

    // Sign-in the user with the credential
    return auth().signInWithCredential(facebookCredential);
}

class LoginScreen extends React.Component {
    
    constructor () {
        super();
        this.state = {

            // Should the screen show an activity indicator
            loading: false,

            // Face in opacity 
            fadeAnim: new Animated.Value(0)
        }
    }

    componentDidMount (){
        // Start fading in the screen
        Animated.timing(
            this.state.fadeAnim,
            {
              toValue: 1,
              duration: 1000,
              useNativeDriver: true
            }
          ).start();
    }

    render() {
        return (
            <Animated.View style={[styles.container,{opacity: this.state.fadeAnim}]}>
                <Text style={styles.title}>Welcome to my chat app </Text>
                {this.state.loading ?
                    <ActivityIndicator></ActivityIndicator>
                :
                <View style={styles.loginButtons}>
                    <TouchableOpacity style={styles.googleButton} onPress={this._googleSignInAsync}>
                        <Text style={styles.loginButtonLabel}>Sign in with Google</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.facebookButton} onPress={this._facebookSignInAsync} >
                        <Text style={styles.loginButtonLabel}>Sign in with Facebook</Text>
                    </TouchableOpacity>
                </View>
                }
            </Animated.View>
        );
    }

    // Login with Google account 
    _googleSignInAsync = async () => {
        // Start activity iindicator  
        this.setState({loading: true});
        onGoogleButtonPress()
        .then(() => {
            // Stop activity iindicator  
            this.setState({loading: false})
        })
        .catch(() => {
            // Stop activity iindicator  
            this.setState({loading: false}); 

            // Inform user that something went wrong
            Alert.alert("Could not sign in")
        });
    };

    // Login with Facebook account 
    _facebookSignInAsync = async () => {
        // Start activity iindicator 
        this.setState({loading: true});
        onFacebookButtonPress()
        .then(() => {
            // Stop activity iindicator  
            this.setState({loading: false})
        })
        .catch((error) => {
            // Stop activity iindicator  
            this.setState({loading: false}); 

            // Inform user that something went wrong
            Alert.alert(error)
        });
    };
}    

const styles = StyleSheet.create({
    container: {
        flex: 1, 
        alignItems: "center", 
        justifyContent: "center"
    },
    title: {
        fontSize: 20,
        marginBottom: 50
    },
    loginButtons: {
        width: "100%",
        marginBottom:20
    },
    googleButton: {
        backgroundColor: "#ea4335",
        padding: 20,
        marginHorizontal: 20,
        marginBottom: 20
    },
    facebookButton: {
        backgroundColor: "#4267b2",
        padding: 20,
        marginHorizontal: 20,
        marginBottom: 20
    },
    loginButtonLabel: {
        color: "#fff",
        textAlign: "center",
        fontSize: 20
     },
});

export default LoginScreen;