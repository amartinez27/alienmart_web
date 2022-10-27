import { FormGroup, FormControl, ValidatorFn, AbstractControl } from '@angular/forms';

export function emailValidator(control: FormControl): { [key: string]: any } {
    var emailRegexp = /[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,3}$/;
    if (control.value && !emailRegexp.test(control.value)) {
        return { invalidEmail: true };
    }
}

export function matchingPasswords(passwordKey: string, passwordConfirmationKey: string) {
    return (group: FormGroup) => {
        let password = group.controls[passwordKey];
        let passwordConfirmation = group.controls[passwordConfirmationKey];
        if (password.value !== passwordConfirmation.value) {
            return passwordConfirmation.setErrors({ mismatchedPasswords: true })
        }
    }
}

export function greaterThan(field: string): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } => {
        const group = control.parent;
        const fieldToCompare = group.get(field);
        const isLessThan = Number(fieldToCompare.value) >= Number(control.value);
        return isLessThan ? { 'lessThan': { value: control.value } } : null;
    }
}