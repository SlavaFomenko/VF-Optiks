import { ErrorMessage, Field, Form, Formik } from 'formik'
import { useContext, useState } from 'react'
import UserContext from '../../context/userContext'
import styles from './adm-create-entity.module.scss'

interface AdmCreateEntityProps {
  mask: Record<string, string>
  postAPI: (...args: any[]) => Promise<any>
  getData: (...args: any[]) => any
}

const AdmCreateEntity: React.FC<AdmCreateEntityProps> = ({
  mask,
  postAPI,
  getData
}): JSX.Element => {
  const [isCreating, setIsCreating] = useState<boolean>(false)
  const user = useContext(UserContext)

  const initialValues = Object.fromEntries(
    Object.keys(mask).map(key => [key, '']),
  )

  const validateForm = (values: Record<string, string>) => {
    // в этом нужно больше разобраться * из *****
    const errors: Record<string, string> = {}
    Object.entries(values).forEach(([fieldName, value]) => {
      if (!value.trim()) {
        errors[fieldName] = 'Поле не може бути пустим'
      }
    })
    return errors
  }

  const renderFormFields = () => {
    return Object.entries(mask).map(([fieldName, label]) => (
      <div key={fieldName}>
        <label htmlFor={fieldName}>{label}</label>
        <Field type='text' id={fieldName} name={fieldName} />
        <ErrorMessage name={fieldName}>
          {msg => <p className={styles.error_message}>{msg}</p>}
        </ErrorMessage>
      </div>
    ))
  }

  const onSubmit = async(value:Record<string,string>) => {
    // console.log(value);
    await postAPI(value,user?.user?.token)
    .then(res=>{
      try{
        if(typeof res === 'number'){
          if(res === 409){
            throw new Error(`${res} = duplicate data`);
          }
        } else {
          console.log(res);
          
          getData(res)
        }

      }catch (err){
        console.log("err" + err);
      }
    })
  }

  return isCreating ? (
    <div className={styles.create_entity_form}>
      <h2>Створити запис</h2>
      <Formik
        initialValues={initialValues}
        onSubmit={onSubmit}
        validate={validateForm} // Исправлено validateForm на validate
      >
        <Form>
          {renderFormFields()}
          <button type='submit'>Створити</button>
          <button onClick={() => setIsCreating(false)}>Закрити</button>
        </Form>
      </Formik>
    </div>
  ) : (
    <button onClick={() => setIsCreating(true)} className={styles.wrapper}>
      +
    </button>
  )
}

export default AdmCreateEntity
