import { Platform } from 'react-native';

import storage from '@react-native-firebase/storage';

export const FireBaseStorage = storage();

export const imagePickerOptions = {
    noData: true,
    maxWidth: 500,
    maxHeight: 500,
};

const getFileLocalPath = response => {
    const { path, uri } = response;
    return Platform.OS === 'android' ? path : uri;
};

const createStorageReferenceToFile = (response,fileName) => {
    return FireBaseStorage.ref("uploads/"+fileName);
};

export const uploadFileToFireBase = (response, fileName) => {
    const fileSource = getFileLocalPath(response);
    const storageRef = createStorageReferenceToFile(response,fileName);
    return storageRef.putFile(fileSource);
};
