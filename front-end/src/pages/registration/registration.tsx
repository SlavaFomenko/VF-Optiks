import { ErrorMessage, Field, Form, Formik, FormikHelpers } from 'formik';
import InputMask from 'react-input-mask';
import * as Yup from 'yup';
import styles from './registration.module.scss'
import { createUser } from '../../api/registerAPI'
import { useState } from 'react'
import { useNavigate } from 'react-router'


interface RegistrationPageProps{

}
export interface RegisterFormValues {
  login: string,
		password: string,
		tel_number: string,
		first_name: string,
		last_name: string,
		confirm_password: string
}

const RegistrationPage = ({}:RegistrationPageProps):JSX.Element => {

	const [error409,setError409] = useState<boolean>(false)
	const navigate = useNavigate()

  const initialValues: RegisterFormValues = {
		login: '',
		password: '',
		tel_number: '',
		first_name: '',
		last_name: '',
		confirm_password: ''
  };

  const validationSchema = Yup.object({
    login: Yup.string().required('Введіть логин'), //! изменить на регулярку
    password: Yup.string().required('Введіть пароль'),
		tel_number: Yup.string().required('Введіть номер телефону'),
		first_name: Yup.string().required('Введіть імʼя'),
		last_name: Yup.string().required('Введіть прізвище'),
		confirm_password: Yup.string()
    .required('Повторіть пароль')
    // .oneOf([Yup.ref('password'), null], 'Паролі повинні співпадати') //! пересмотреть в документации
		.test('passwords-match', 'Паролі повинні співпадати', function (value) {
      return this.parent.password === value;
    })

  });

  const onSubmit = async(values: RegisterFormValues , {resetForm}:FormikHelpers<RegisterFormValues>) => {

		try {
			const statusCode: number = await createUser(values);
			
			if(typeof statusCode === 'number'){

				if(statusCode === 409){
					setError409(true);
					console.error("Error status code = " + statusCode);
				}
				if(statusCode === 200){
					navigate('/login')
				}
				resetForm();
				return
			}


			resetForm();
		} catch (error) {
			console.error('Произошла ошибка при создании пользователя', error);
		}
  };
	
	return (
		<main className={styles.wrapper_register_page}>
		  {error409 && <div className={styles.error_duplicate_data}>Такий користувач вже існує!</div>}
      <section className={styles.wrapper_register_form}>
						<h1>Реєстрація</h1>
						<Formik
						 initialValues={initialValues}
						 validationSchema={validationSchema}
						 onSubmit={onSubmit}>
						<Form className={styles.login_form}>
								<div className={styles.input_wrapper}>
										<Field
												type="text"
												name="login"
												placeholder="Логін"
												onClick={()=>setError409(false)}
										/>
										<ErrorMessage name="login" component="div" className={styles.error_message} />
								</div>
								<div className={styles.input_wrapper}>
										<Field
												as={InputMask}
												mask="+38(099)999-99-99"
												type="tel"
												name="tel_number"
												placeholder="Номер телефону"
												onClick={()=>setError409(false)}
										/>
										<ErrorMessage name="tel_number" component="div" className={styles.error_message} />
								</div>
								<div className={styles.input_wrapper}>
										<Field
												type="text"
												name="first_name"
												placeholder="Імʼя"
												onClick={()=>setError409(false)}
										/>
										<ErrorMessage name="first_name" component="div" className={styles.error_message} />
								</div>

								<div className={styles.input_wrapper}>
										<Field
												type="password"
												name="password"
												placeholder="Пароль"
												onClick={()=>setError409(false)}
										/>
									<ErrorMessage name="password" component="div" className={styles.error_message} />
								</div>
								<div className={styles.input_wrapper}>
										<Field
												type="text"
												name="last_name"
												placeholder="Фамілія"
												onClick={()=>setError409(false)}
										/>
										<ErrorMessage name="last_name" component="div" className={styles.error_message} />
								</div>

								<div className={styles.input_wrapper}>
										<Field
												type="password"
												name="confirm_password"
												placeholder="Повторіть пароль"
												onClick={()=>setError409(false)}
										/>
										<ErrorMessage name="confirm_password" component="div" className={styles.error_message} />
								</div>

								<button type="submit" >
										Зареєструватися
								</button>
							</Form>
							</Formik>
						</section>
				</main>
);
}

export default RegistrationPage