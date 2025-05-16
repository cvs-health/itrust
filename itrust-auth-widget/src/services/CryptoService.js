/*
 Copyright 2024 CVS Health and/or one of its affiliates

 Licensed under the Apache License, Version 2.0 (the "License");
 you may not use this file except in compliance with the License.
 You may obtain a copy of the License at

      https://www.apache.org/licenses/LICENSE-2.0

 Unless required by applicable law or agreed to in writing, software
 distributed under the License is distributed on an "AS IS" BASIS,
 WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 See the License for the specific language governing permissions and
 limitations under the License.
 */

// Desc: Utility functions for crypto
import axiosInstance from "./AxiosInstance";
import nacl from 'tweetnacl';
import naclUtil, { decodeBase64, encodeBase64 } from 'tweetnacl-util';

// Generate ED25519 Signing Key Pair
export const generateSigningKeyPair = () => {
    return nacl.sign.keyPair();
}

// Generate X25519 Encryption Key Pair
export const generateEncryptionKeyPair = () => {
    return nacl.box.keyPair();
}

// Derive a shared secret using your private key and the recipient's public key
export const deriveSharedSecret = (encodedPrivateKey, encodedTheirPublicKey) => {
    // console.log ('Encoded Private Key: ', encodedPrivateKey)
    const privateKey = decodeBase64(encodedPrivateKey);
    // console.log ('private key: ', privateKey)
    const theirPublicKey = decodeBase64(encodedTheirPublicKey)
    // console.log ('their public key: ', theirPublicKey)
    const sharedSecret = nacl.scalarMult(privateKey, theirPublicKey);
    // console.log ('shared secret: ', sharedSecret)
    return encodeBase64(sharedSecret);
}

// Encrypt messages using the receiver's public encryption key
export const encryptMessage = (message, nonce, sharedSecret) => {
    const messageUint8 = naclUtil.decodeUTF8(message);
    const encryptedMessage = nacl.secretbox(messageUint8, nonce, sharedSecret);
    return encryptedMessage;

}

// Decrypt messages using the receiver's private encryption key
export const decryptMessage = (encodedEncryptedMessage, encodedNonce, encodedSharedSecret) => {
    try {
    const encryptedMessage = decodeBase64(encodedEncryptedMessage)
    const nonce = decodeBase64(encodedNonce)
    const sharedSecret = decodeBase64(encodedSharedSecret)
    const decryptedMessage = nacl.secretbox.open(encryptedMessage, nonce, sharedSecret)
    const encodedMessage = naclUtil.encodeUTF8(decryptedMessage)
    return encodedMessage
    }catch (e){
        // // console.log('Error: ', e)
        return null
    }
}

// Sign a message using the sender's private signing key
export const signMessage = (message, secretKey) => {
    const messageUint8 = naclUtil.decodeUTF8(message);
    const signedMessage = nacl.sign(messageUint8, secretKey);
    return signedMessage;
}

// Verify a signed message using the sender's public signing key
export const verifyMessage = (signedMessage, publicKey) => {
    const verifiedMessage = nacl.sign.open(signedMessage, publicKey);
    return verifiedMessage ? naclUtil.encodeUTF8(verifiedMessage) : null;
}



// Get Credential Metadata 
export const keyExchange = async (data) => {
    try {
        const response = await axiosInstance.post(`/das/api/v1/key-exchange`, data);
        if(response.status !== 200) {
            throw new Error("Network response was not ok");
        }
        //console.log ('response', response)
        return response.data;
    } catch (error) {
        console.error("There was a problem with the fetch operation:", error);
        throw error;
    }
}