import { Injectable } from '@angular/core';
import { Router } from "@angular/router";
import { AngularFireAuth } from "@angular/fire/auth";
import { AngularFireModule } from "@angular/fire";
import { UsersService } from './users.service';
import { AppSettings } from '../app.settings';
import firebase from 'firebase/app';
import { take, switchMap } from 'rxjs/operators';
import { Observable, from, of } from 'rxjs';
import { AppService } from './app.service';
import { WishlistService } from './wishlist.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  user: any;

  constructor(public afAuth: AngularFireAuth, public router: Router, public usersService: UsersService,
    public appSettings: AppSettings, public firebase: AngularFireModule, public AppService: AppService,
    public wishlistService: WishlistService) {
    this.afAuth.onAuthStateChanged(user => {
      if (user) {
        this.user = user;
        /*user.getIdToken(true).then(token => {
          this.wishlistService.getUsersWishlist(token).subscribe(data => {
            this.AppService.Data.wishList = data;
          })
        })*/
        //localStorage.setItem('user', JSON.stringify(this.user));
      } else {
        //localStorage.setItem('user', null);
      }
    })
  }

  loginWithEmailAndPassword(email: string, password: string): any {
    return new Promise<any>((resolve, reject) => {
      this.afAuth.signInWithEmailAndPassword(email, password).then(res => {
        res.user.getIdToken(true).then(token => {
          this.usersService.getLoggedUser(token).subscribe(u => {
            localStorage.setItem('user', JSON.stringify(u));
            //localStorage.setItem('token', token);
            resolve(u);
          });
          this.wishlistService.getUsersWishlist(token).subscribe(data => {
            this.AppService.Data.wishList = data;
          })
        }).catch(err => {
          reject(err);
        })
      }).catch(err => {
        reject(err);
      })
    })
  }

  signUpWithEmailAndPassword(form: any): any {
    return new Promise<any>((resolve, reject) => {
      this.afAuth.createUserWithEmailAndPassword(form.email, form.password).then(user => {
        form.firebase_uid = user.user.uid;
        user.user.getIdToken(true).then(token => {
          this.usersService.createUser(form, token).subscribe(u => {
            //this.usersService.getLoggedUser(token).subscribe(r => {
            localStorage.setItem('user', JSON.stringify(u));
            resolve(u);
            //})
          })
        });
      }, err => {
        reject(err);
      })
    });
  }

  GoogleAuth() {
    return this.AuthLogin(new firebase.auth.GoogleAuthProvider());
  }

  AuthLogin(provider) {
    return this.afAuth.signInWithPopup(provider).then(result => {
      if (result.additionalUserInfo.isNewUser) {
        var userObj = result.user;
        var user = { first_name: userObj.displayName, email: userObj.email, firebase_uid: userObj.uid, image_url: userObj.photoURL }
        userObj.getIdToken(true).then(token => {
          this.usersService.createUser(user, token).subscribe(user => {
            localStorage.setItem('user', JSON.stringify(user));
            result.user.getIdToken(true).then(token => {
              localStorage.setItem('token', token);
              this.router.navigate(['/']);

            })
            this.appSettings.currentUser = user;
          })
        })
      } else {
        result.user.getIdToken(true).then(token => {
          this.usersService.getLoggedUser(token).subscribe(u => {
            localStorage.setItem('user', JSON.stringify(u));
            localStorage.setItem('token', token);
            this.router.navigate(['/']);

            this.appSettings.currentUser = u;
          });
          this.wishlistService.getUsersWishlist(token).subscribe(data => {
            this.AppService.Data.wishList = data;
          })
        })

      }
    }).catch(err => {
      console.log('log in with google error');
    })
  }

  async logout() {
    await this.afAuth.signOut();
    this.appSettings.currentUser = null;
    this.AppService.Data.wishList = [];
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    this.router.navigate(['/sign-in']);
  }

  get isLoggedIn(): boolean {
    const user = JSON.parse(localStorage.getItem('user'));
    return user != null;
  }

  getToken(): Observable<string | null> {
    return this.afAuth.authState.pipe(
      take(1),
      switchMap(user => {
        if (user) {
          return from(user.getIdToken(true));
        }
        return of(null);
      })
    )
  }


  formatDate(date) {
    var d = new Date(date),
      month = '' + (d.getMonth() + 1),
      day = '' + d.getDate(),
      year = d.getFullYear();
    if (month.length < 2) month = '0' + month;
    if (day.length < 2) day = '0' + day;
    return [year, month, day].join('-');
  }
}
