import { ErrorMessage, Field, Form, Formik } from 'formik'
import React, { useContext, useState } from 'react'
import * as Yup from 'yup'
// import {patchCategory } from '../../api/categoryAPI'
import UserContext from '../../context/userContext'
import styles from './editing-input.module.scss'

interface Editable {
  [key: string]: any
}

interface selectValues {
  valueName: string
  [key: string]: string | number
}

interface EditingInputProps {
  dataProps: Editable
  mask: Record<string, string | selectValues>
  patchData?: (token: string, values: Editable, id: number) => Promise<any>
  deleteData?: (token: string, id: number) => Promise<any>
}

const EditingInput: React.FC<EditingInputProps> = ({
  mask,
  dataProps,
  patchData,
  deleteData,
}) => {
  // patchCategory(data,data.id)
  const [data, setData] = useState(dataProps)
  const [isEditing, setIsEditing] = useState<boolean>(false)
  const user = useContext(UserContext)
  const [error, setError] = useState<string | null>(null) //не обработано вывод 409 (дубликация) ошибки * из *****
  const [isComponentMounted, setIsComponentMounted] = useState<boolean>(true) // флаг для размонтирования

  const onSubmit = (values: Editable) => {
    // console.log(values);
    
    const id = Object.keys(values).find(property => property.includes("id"))


    setIsEditing(false)

    try {
      
      if (user?.user?.token !== undefined && id && patchData) {
        patchData(user?.user?.token, values, Number(values[id])).then(res => {
          if (typeof res === 'number') {
            if (res === 409) {
              setError(
                'Дубликация данных. Пожалуйста, проверьте введенные значения.',
              )
              throw new Error(`status err ${res}`)
            } else {
              console.log(`status err ${res}`)
            }
          } else {
            setData(res)
            setError(null)
          }
        })
        return
      }
      throw new Error('user === undefined')
    } catch (err) {
      console.error(err)
    }
    console.log('Updated values:', values)
  }

  const delData = async (id: number, token: string) => {
    try {
      if (deleteData) {
        await deleteData(token, id).then(res => {
          console.log(res)

          if (res) {
            if (res === 200) {
              setIsComponentMounted(false)
              return
            } else {
              throw new Error(`res === ${res}`)
            }
          } else {
            throw new Error('res =' + res)
          }
        })
      }
    } catch (err) {
      console.error('err' + err)
    }
  }

  const handleReset = () => {
    setIsEditing(false)
  }

  if (!isComponentMounted) {
    return null
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
              // console.log(optionValue, optionLabel);
              if (optionValue === 'valueName') {
                return <></>
              }
              return (
                <option key={optionValue} value={optionValue}>
                  {`${optionLabel}`}
                </option>
              )
            })}
          </Field>
        ) : (
          <Field type='text' id={fieldName} name={fieldName} 
          
          disabled={fieldName.includes('id')}/>
        )}
        <ErrorMessage name={fieldName}>
          {msg => <p className={styles.error_message}>{msg}</p>}
        </ErrorMessage>
      </div>
    ))
  }
  const validateForm = (values: Record<string, string>) => {
    // в этом нужно больше разобраться * из *****

    
    const errors: Record<string, string> = {}
    Object.entries(values).forEach(([fieldName, value]) => {
      // console.log(value);
      
      if (!`${value}`.trim()) {
        errors[fieldName] = 'Поле не може бути пустим'
      }
    })
    return errors
  }

  const initialValues = Object.fromEntries(
    Object.keys(data).map(key => [key,data[key]]),
  )

  return JSON.stringify(mask) === JSON.stringify(data) ? (
    <li className={styles.active}>
      <div className={styles.content}>
        {Object.keys(mask).map(key => (
          <span key={key}> {`${mask[key]}`} </span>
        ))}
      </div>
    </li>
  ) : isEditing ? (
    <li className={styles.not_active}>
      <h2>Редагування</h2>

      <Formik
        initialValues={initialValues}
        onSubmit={onSubmit}
        validate={validateForm}
        onReset={handleReset}
      >
        <Form>
          {renderFormFields()}
          <button type='submit'>Зберегти</button>
          <button type='reset'>Відмінити</button>
        </Form>
      </Formik>
    </li>
  ) : (
    <li className={styles.active}>
      <div className={styles.content}>
        {data !== undefined && data !== null
          ? Object.keys(data).map(key => <span key={key}> {data[key]} </span>)
          : 'err'}
      </div>
      <div className={styles.buttons}>
        <button onClick={() => setIsEditing(!isEditing)}>Редагувати</button>
        <button
          onClick={() => {
            // data !== undefined && data !== null
            Object.keys(data).map(key => {
              if (key.includes('id')) {
                if (user?.user?.token) {
                  delData(data[key], user?.user?.token)
                }
              }
            })
          }}
        >
          Видалити
        </button>
      </div>
    </li>
  )
}

export default EditingInput
