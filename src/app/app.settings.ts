import { Injectable } from '@angular/core';
import { ParseError } from '@angular/compiler';

export class Settings {
    constructor(public name: string,
        public theme: string,
        public rtl: boolean,
        public adminSidenavIsOpened: boolean,
        public adminSidenavIsPinned: boolean,
        public adminSidenavUserBlock: boolean) { }
}

@Injectable()
export class AppSettings {
    public settings = new Settings(
        'Alienmart',  // theme name
        'red',     // green, blue, red, pink, purple, grey
        false,       // true = rtl, false = ltr
        true,        // adminSidenavIsOpened
        true,        // adminSidenavIsPinned 
        true         // adminSidenavUserBlock 
    );
    currentUser: any = localStorage.getItem('user') != null ? JSON.parse(localStorage.getItem('user')) : null;
}