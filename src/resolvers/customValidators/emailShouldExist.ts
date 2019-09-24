import {
  registerDecorator,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface
} from "class-validator";
import { userModel } from "../../models/user";

@ValidatorConstraint({ async: true })
export class emailValidation implements ValidatorConstraintInterface {
    async validate(email: string) {
      const user = await userModel.findOne({ email })
      return !Boolean(user)
    }
}

export function emailShouldExist(validationOptions?: ValidationOptions) {
   return function (object: Object, propertyName: string) {
        registerDecorator({
            target: object.constructor,
            propertyName: propertyName,
            options: validationOptions,
            constraints: [],
            validator: emailValidation
        });
   };
}