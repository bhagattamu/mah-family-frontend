import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { URL_CONSTANT } from 'src/app/@core/constants/url.constant';
import { LocalStorageService } from './localstorage.service';
import { HttpService } from './http.service';
import { Router } from '@angular/router';
import { LOCAL_STORAGE_ITEM } from '../constants/local-storage.constant';

@Injectable({ providedIn: 'root' })
export class AuthService {
    constructor(private httpService: HttpService, private localStorageService: LocalStorageService, private router: Router) {}

    private loggedIn = new BehaviorSubject<boolean>(false);
    private profileChanged = new Subject<boolean>();

    setLogin() {
        this.loggedIn.next(true);
    }

    setLogout() {
        this.loggedIn.next(false);
    }

    getLoginStatus(): Observable<boolean> {
        return this.loggedIn.asObservable();
    }

    setProfileURL(): void {
        this.profileChanged.next(true);
    }

    getNewProfileURL(): Observable<boolean> {
        return this.profileChanged.asObservable();
    }
    /** User Authenticate **/
    registerUser(user: any): Observable<any> {
        return this.httpService.post(URL_CONSTANT.USER_REGISTER, user);
    }

    loginUser(user: any): Observable<any> {
        return this.httpService.post(URL_CONSTANT.USER_LOGIN, user);
    }

    requestPassword(requestPasswordBody: string): Observable<any> {
        return this.httpService.post(URL_CONSTANT.REQUEST_RECOVERY, requestPasswordBody);
    }

    auth(): Observable<any> {
        return this.httpService.get(URL_CONSTANT.IS_AUTHENTICATED);
    }

    getAccessToken(): string {
        return this.localStorageService.getItem(LOCAL_STORAGE_ITEM.ACCESS_TOKEN);
    }

    getNewAccessToken(accessToken: string) {
        return this.httpService.post(URL_CONSTANT.REFRESH_TOKEN, {
            accessToken: accessToken
        });
    }

    setAccessToken(token: string): void {
        this.localStorageService.setItem(LOCAL_STORAGE_ITEM.ACCESS_TOKEN, token);
    }

    logout(): Observable<any> {
        return this.httpService.post(URL_CONSTANT.USER_LOGOUT);
    }

    isRequestRecoveryRouteValid(userId: string): Observable<any> {
        return this.httpService.get(`${URL_CONSTANT.IS_REQUEST_RECOVERY_CODE_ROUTE_VALID}/${userId}`);
    }

    resendRequestRecovery(userId: string): Observable<any> {
        return this.httpService.post(URL_CONSTANT.REREQUEST_RECOVERY, { userId });
    }

    getResetPasswordRouteByCode(recoveryCodeBody: any): Observable<any> {
        return this.httpService.post(URL_CONSTANT.GET_RECOVERY_LINK_BY_CODE, recoveryCodeBody);
    }

    isResetPasswordRouteValid(key: string, userId: string): Observable<any> {
        return this.httpService.get(URL_CONSTANT.IS_RESET_PASSWORD_ROUTE_VALID, {
            key,
            id: userId
        });
    }

    resetPassword(resetPasswordDto: any): Observable<any> {
        return this.httpService.put(URL_CONSTANT.RESET_PASSWORD, resetPasswordDto);
    }

    changePassword(changePasswordDto: any): Observable<any> {
        return this.httpService.put(URL_CONSTANT.CHANGE_PASSWORD, changePasswordDto);
    }

    logoutUser(): void {
        this.setLogout();
        this.logout().subscribe(
            (res) => {
                this.setLogout();
                this.localStorageService.clearStorage();
                this.navigateToLogin();
            },
            (err) => {
                this.setLogout();
                this.localStorageService.clearStorage();
                this.navigateToLogin();
            }
        );
    }

    logoutFromFrontend(): void {
        this.setLogout();
        this.localStorageService.clearStorage();
        this.navigateToLogin();
    }

    /** Admin api start **/

    getAllUser(query: any): Observable<any> {
        return this.httpService.get(URL_CONSTANT.USER_BASE + '/all', query);
    }

    verifyUser(userId: string): Observable<any> {
        return this.httpService.post(URL_CONSTANT.USER_BASE + `/verify/${userId}`);
    }

    /** Admin api end **/

    navigateToLogin(): void {
        this.router.navigate(['/auth/login']);
    }

    /** User Language **/
    getUserLang(): string {
        return this.localStorageService.getItem('language');
    }

    setUserLang(lang: string): void {
        this.localStorageService.setItem('language', lang);
    }

    /** User Data **/
    getUserData(): any {
        return this.localStorageService.getItem(LOCAL_STORAGE_ITEM.USER_DATA);
    }

    getUser(): Observable<any> {
        return this.httpService.get(URL_CONSTANT.USER_BASE);
    }

    updateUserBasicInfo(basicInfoDto: any, hasFormData: boolean): Observable<any> {
        return this.httpService.put(URL_CONSTANT.USER_BASE + `/basic-information`, basicInfoDto, hasFormData);
    }

    getProfilePicture(userId: string, imagename: string): Observable<any> {
        return this.httpService.get(`/files/user-picture/${userId}/${imagename}`);
    }

    getAllUserPictures(userId: string): Observable<any> {
        return this.httpService.get(`/files/user/pictures/${userId}`);
    }

    setUserData(uData: any): void {
        this.localStorageService.setItem(LOCAL_STORAGE_ITEM.USER_DATA, uData);
    }

    getUserFamily(): Observable<any> {
        return this.httpService.get(URL_CONSTANT.USER_BASE + '/family');
    }

    createUserFamily(createUserFamilyDto: any): Observable<any> {
        return this.httpService.post(URL_CONSTANT.USER_BASE + '/family', createUserFamilyDto);
    }

    createUserLanguage(createUserLanguageDto: any): Observable<any> {
        return this.httpService.post(URL_CONSTANT.USER_BASE + '/language', createUserLanguageDto);
    }

    isAdmin(): boolean {
        const user = this.getUserData();
        if (user.roles) {
            return user.roles.includes('admin');
        }
        return false;
    }

    languageInformationMenuStatus = new BehaviorSubject<boolean>(false);

    setLanguageInformationMenuStatus(status: boolean): void {
        this.languageInformationMenuStatus.next(status);
    }

    getLanguageInformationMenuStatus(): Observable<boolean> {
        return this.languageInformationMenuStatus.asObservable();
    }
}
