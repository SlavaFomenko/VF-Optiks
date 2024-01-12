import { Field, Form, Formik } from 'formik'
import { useContext, useState } from 'react'
import styles from './search-line.module.scss'
import UserContext from '../../context/userContext'

type AnyFunction = (...args: any[]) => any

interface AdmSearchLine {
  setData: AnyFunction
  getData: (...args: any[]) => Promise<any>
}

const AdmSearchLine: React.FC<AdmSearchLine> = ({
  getData,
  setData,
}): JSX.Element => {
  const [isError, setIsError] = useState<boolean>(false)

  const user = useContext(UserContext)
  const initialValues = {
    data: '',
  }

  const onSubmit = async (values: { data: string }) => {
    const data = values.data ? values.data : undefined
    const token = user?.user? user.user.token:'token' 
    await getData(token, undefined, data) // знаю що це погано * из ****)
      .then(res => {
        try {
          if (typeof res === 'number') {
            if (res === 404) {
              setIsError(true)
              setData(null)
            }
            throw new Error(`${res}`)
          } else {
            console.log(res)
            setData(res)
          }
        } catch (err) {
          console.error('error' + err)
        }
      })
  }

  return (
    <Formik initialValues={initialValues} onSubmit={onSubmit}>
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
    // </div>
  )
}

export default AdmSearchLine
