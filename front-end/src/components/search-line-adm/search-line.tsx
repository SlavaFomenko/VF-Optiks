import { Field, Form, Formik } from 'formik'
import { useContext, useState } from 'react'
import styles from './search-line.module.scss'
import UserContext from '../../context/userContext'

type AnyFunction = (...args: any[]) => any

interface AdmSearchLine {
  setData: AnyFunction
}

const AdmSearchLine: React.FC<AdmSearchLine> = ({
  setData,
}): JSX.Element => {
  const [isError, setIsError] = useState<boolean>(false)

  const user = useContext(UserContext)
  const initialValues = {
    data: '',
  }

  const onSubmit = async (values: { data: string }) => {
    // console.log(values);
    
    const data = values.data ? values.data : undefined
    setData(data,'name')
  }

  return (
    <Formik initialValues={initialValues} onSubmit={onSubmit} validateOnBlur={false}>
      <Form className={styles.form}>
        <Field
          key='key'
          type='text'
          placeholder={'Введіть назву'}
          name='data'
        />
        <button type='submit'>Пошук</button>
      </Form>
    </Formik>
  )
}

export default AdmSearchLine
