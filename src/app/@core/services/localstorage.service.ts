import { Injectable } from '@angular/core';
import * as CryptoJS from 'crypto-js';

@Injectable({
    providedIn: 'root'
})
export class LocalStorageService {
    setItem(key: string, value: any) {
        const stringifiedValue = JSON.stringify(value);
        const encryptedValue = this.encryptByAES(stringifiedValue, 'secretkey');
        localStorage.setItem(key, encryptedValue);
    }

    getItem(key: string) {
        const encryptedValue = localStorage.getItem(key);
        if (encryptedValue) {
            try {
                const stringifiedValue = this.decryptByAES(encryptedValue, 'secretkey');
                if (stringifiedValue) {
                    return JSON.parse(stringifiedValue);
                }
            } catch (err) {
                return '';
            }
        }
        return '';
    }

    clearStorage() {
        localStorage.clear();
    }

    encryptByAES(payload: string, secret: string) {
        return CryptoJS.AES.encrypt(payload, secret).toString();
    }

    decryptByAES(encrypted: string, secret: string) {
        return CryptoJS.AES.decrypt(encrypted, secret).toString(CryptoJS.enc.Utf8);
    }
}
