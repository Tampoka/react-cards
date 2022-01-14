import {FormEvent, useCallback, useState} from 'react';
import {useDispatch} from 'react-redux';
import {SignUpData} from "../../api/cards-api";
import {useAppSelector} from "../../redux/store";
import {setAppError} from "../../redux/app-reducer";
import {Register} from "./Register";
import {signUp} from "../../redux/signUp-reducer";

export const RegisterContainer = () => {
        const [values, setValues] = useState<SignUpData>({email: '', password: '', confirmPassword: ''});
        const [showPassword, setShowPassword] = useState(false)

        const dispatch = useDispatch();

        const error = useAppSelector<string | null>(state => state.app.error);
        const isLoading = useAppSelector<boolean>(state => state.app.isLoading);
        const signUpSuccess = useAppSelector<boolean>(state => state.signUp.signUpSuccess);

        const toggleShowPassword = () => {
            setShowPassword(!showPassword)
        }

        const validate = () => {
            const regex = /^[a-zA-Z0-9.!#$%&'*+\/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/
            if (values.email === '' || values.password === '') {
                dispatch(setAppError('Please fill out all required fields and try again'))
            } else if (!regex.test(values.email)) {
                dispatch(setAppError('Please enter valid email address.'))
            } else if (values.password.trim().length <= 7) {
                dispatch(setAppError('Password must be more than 7 characters.'))
            } else if (values.password !== values.confirmPassword) {
                dispatch(setAppError('Please make sure your passwords match'))
            } else return 1
        }

        const onSubmitHandler = (e: FormEvent) => {
            e.preventDefault();
            if (validate() === 1) {
                setValues({email: '', password: '', confirmPassword: ''});
                dispatch(signUp(values));
            }
        }

        return <Register isLoading={isLoading}
                         errorMsg={error}
                         values={values}
                         setValues={setValues}
                         onSubmitHandler={onSubmitHandler}
                         registrationSuccess={signUpSuccess}
                         showPassword={showPassword}
                         toggleShowPassword={toggleShowPassword}
        />;
    }
;
