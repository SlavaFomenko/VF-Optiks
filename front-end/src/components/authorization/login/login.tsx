import React, { useEffect } from 'react';
import { Formik, Form, Field, ErrorMessage, useFormik } from 'formik';
import * as Yup from 'yup';
import styles from './login.module.scss';
import { useNavigate } from 'react-router-dom'


interface LoginPageProps {
  setAuthorizationIsActive: React.Dispatch<React.SetStateAction<boolean>>;
}

interface LoginFormValues {
  login: string;
  password: string;
}

const LoginPage = ({ setAuthorizationIsActive }: LoginPageProps): JSX.Element => {
  const navigate = useNavigate();

  useEffect(() => {
    setAuthorizationIsActive(true);
    return () => setAuthorizationIsActive(false);
  }, []);

  const initialValues: LoginFormValues = {
    login: '',
    password: '',
  };

  const validationSchema = Yup.object({
    login: Yup.string().required('Введите логин'), //! изменить на регулярку
    password: Yup.string().required('Введите пароль'),
  });

  const onSubmit = (values: LoginFormValues) => {
		// coming soon
    console.log(values);
  };

  const formik = useFormik({
    initialValues,
    validationSchema,
    onSubmit,
  });

  return (
    <main className={styles.wrapper_login_page}>
      <section className={styles.wrapper_login_form}>
        <h1>Авторизація</h1>

        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={onSubmit}
        >
          <Form className={styles.login_form}>
            <div className={styles.input_wrapper}>
              <Field type='text' name='login' placeholder='Логін' className={styles.input} />
              <ErrorMessage name="login" component="div" className={styles.error_message} />
            </div>
            <div className={styles.input_wrapper}>
              <Field type='password' name='password' placeholder='Пароль' className={styles.input} />
              <ErrorMessage name="password" component="div" className={styles.error_message} />
            </div>
            <button type='submit'>Увійти</button>
            <span>
              Ще немає аккаунту?
              <br />
              <a href={'/registration'}>Зареєструватись!</a>
            </span>
          </Form>
        </Formik>
      </section>
    </main>
  );
};

export default LoginPage;
