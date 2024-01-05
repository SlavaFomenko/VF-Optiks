import { ErrorMessage, Field, Form, Formik, FormikHelpers } from 'formik';
import React, { useContext, useEffect, useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import * as Yup from 'yup';
import { getUser } from '../../api/loginAPI';
import UserContext from '../../context/userContext';
import styles from './login.module.scss';


interface LoginPageProps {
  // setUser: React.Dispatch<React.SetStateAction<UserContext | null>>,
  setAuthorizationIsActive: React.Dispatch<React.SetStateAction<boolean>>
}

interface LoginFormValues {
  login: string;
  password: string;
}

const LoginPage = ({ setAuthorizationIsActive }: LoginPageProps): JSX.Element => {
  const [error404, setError404] = useState<boolean>(false);
  const navigate = useNavigate()
  const user = useContext(UserContext)
  useEffect(()=>{
    setAuthorizationIsActive(true)
    return(()=>{
      setAuthorizationIsActive(false)
    })
  },[])

  const initialValues: LoginFormValues = {
    login: '',
    password: '',
  };

  const validationSchema = Yup.object({
    login: Yup.string().required('Введите логин'), //! изменить на регулярку
    password: Yup.string().required('Введите пароль'),
  });

  const onSubmit = async(values: LoginFormValues,{resetForm}:FormikHelpers<LoginFormValues>) => {
		const response = await getUser(values)
    
    if(typeof response === 'number'){

      if(response === 404){
        setError404(true);
      }
      console.error("Error status code = " + response);
      resetForm();
      return
    }

    user?.setUser(response)
    resetForm();
    setAuthorizationIsActive(false)
    navigate('/')
  };

  return (
    <main className={styles.wrapper_login_page}>
      {error404 && <div className={styles.error_not_found}>Не вірний логін або пароль!</div>}
      <section className={styles.wrapper_login_form}>
        <h1>Авторизація</h1>
        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={onSubmit}>
          <Form className={styles.login_form}>
            <div className={styles.input_wrapper}>
              <Field type='text' name='login' placeholder='Логін' className={styles.input} onClick={()=>setError404(false)} />
              <ErrorMessage name="login" component="div" className={styles.error_message} />
            </div>
            <div className={styles.input_wrapper}>
              <Field type='password' name='password' placeholder='Пароль' className={styles.input} onClick={()=>setError404(false)}/>
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
