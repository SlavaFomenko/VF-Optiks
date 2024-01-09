import { Field, Form, Formik } from 'formik'
import styles from './search-line.module.scss'
import { useState } from 'react'

type AnyFunction = (...args: any[]) => any

interface AdmSearchLine {
  setData: AnyFunction
  getData: (...args: any[]) => Promise<any>
}

const AdmSearchLine: React.FC<AdmSearchLine> = ({
  getData,
  setData,
}): JSX.Element => {
  
  const [isError ,setIsError] = useState<boolean>(false)

  const initialValues = {
    name: '',
  }

  const onSubmit = async (values: { name: string }) => {

    const data = values.name ? values.name : undefined
    await getData(undefined, data) // знаю що це погано * из ****)
    .then(res => {
      try {
        if (typeof res === 'number') {
          if(res === 404){
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
    <div className={styles.wrapper}>
      <Formik initialValues={initialValues} onSubmit={onSubmit}>
        <Form>
          <Field
            key='key'
            type='text'
            placeholder={'Введіть назву'}
            name='name'
          />
          <button type='submit'>Пошук</button>
        </Form>
      </Formik>
    </div>
  )
}

export default AdmSearchLine
