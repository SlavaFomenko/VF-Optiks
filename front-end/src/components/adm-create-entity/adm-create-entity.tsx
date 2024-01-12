import { ErrorMessage, Field, Form, Formik } from 'formik'
import { useContext, useState } from 'react'
import UserContext from '../../context/userContext'
import CreateEntityIMG from '../../images/admin-panel/create-entity-image.svg'
import styles from './adm-create-entity.module.scss'

interface selectValues {
  valueName: string
  [key: string]: string | number
}

interface AdmCreateEntityProps {
  mask: Record<string, string | selectValues>
  postAPI: (...args: any[]) => Promise<any>
  getData: (...args: any[]) => any  //PS за это мне стыдно ;-)
}

const AdmCreateEntity: React.FC<AdmCreateEntityProps> = ({
  mask,
  postAPI,
  getData,
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


  const onSubmit = async (value: Record<string, string>) => {
    
    await postAPI(user?.user?.token,value).then(res => {
      try {
        if (typeof res === 'number') {
          if (res === 409) {
            throw new Error(`${res} = duplicate data`)
          }
        } else {
          console.log(res)
          getData(res)
          setIsCreating(false)
        }
      } catch (err) {
        console.log('err' + err)
      }
    })
  }

  const renderFormFields = () => {
    return Object.entries(mask).map(([fieldName, fieldConfig]) => (
      <div key={fieldName}>
        <label htmlFor={fieldName}>
          {typeof fieldConfig === 'object'
            ? fieldConfig.valueName
            : fieldConfig}
        </label>
        {typeof fieldConfig === 'object' ? (
          <Field as='select' id={fieldName} name={fieldName}>
            <option value='' disabled>
              Виберіть{' '}
              {typeof fieldConfig === 'object'
                ? fieldConfig.valueName
                : fieldConfig}
            </option>
            {Object.entries(fieldConfig).map(([optionValue, optionLabel]) => {
              console.log(optionValue, optionLabel);
              if(optionValue === "valueName"){
                return(<></>)
              }
              return (
                <option key={optionValue} value={optionValue}>
                  {`${optionLabel}`}
                </option>
              )
            })}
          </Field>
        ) : (
          <Field type='text' id={fieldName} name={fieldName} />
        )}
        <ErrorMessage name={fieldName}>
          {msg => <p className={styles.error_message}>{msg}</p>}
        </ErrorMessage>
      </div>
    ))
  }

  return isCreating ? (
    <>
      <div className={styles.create_entity_form}>
        <h2>Створити запис</h2>
        <Formik
          initialValues={initialValues}
          onSubmit={onSubmit}
          validate={validateForm}
        >
          <Form>
            {renderFormFields()}
            <button type='submit'>Створити</button>
            <button onClick={() => setIsCreating(false)}>Закрити</button>
          </Form>
        </Formik>
      </div>
      <button onClick={() => setIsCreating(true)} className={styles.button}>
        <img src={CreateEntityIMG} alt='+' />
      </button>
    </>
  ) : (
    <button onClick={() => setIsCreating(true)} className={styles.button}>
      <img src={CreateEntityIMG} alt='+' />
    </button>
  )
}

export default AdmCreateEntity
