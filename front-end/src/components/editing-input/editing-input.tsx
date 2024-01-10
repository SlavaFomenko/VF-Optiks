import { ErrorMessage, Field, Form, Formik } from 'formik'
import React, { useContext, useState } from 'react'
import * as Yup from 'yup'
// import {patchCategory } from '../../api/categoryAPI'
import UserContext from '../../context/userContext'
import styles from './editing-input.module.scss'

interface Editable {
  [key: string]: any
}
interface Mask {
  [key: string]: any
}
interface EditingInputProps {
  dataProps: Editable
  mask: Mask
  patchData?: (values: Editable, id: number, token: string) => Promise<any>
  deleteData?: (id: number, token: string) => Promise<any>
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

  const validationSchema = Yup.object().shape(
    Object.keys(dataProps).reduce((acc, key) => {
      acc[key as string] = Yup.string().required(
        'Це поле обовʼязкове для заповнення!',
      )
      return acc
    }, {} as { [key: string]: Yup.StringSchema<string> }),
  )

  const onSubmit = (values: Editable) => {
    const id = Object.keys(values).find(key => key.includes('id'))

    setIsEditing(false)

    try {
      if (user?.user?.token !== undefined && id && patchData) {
        patchData(values, Number(values[id]), user?.user?.token).then(res => {
          if (typeof res === 'number') {
            if (res === 409) {
              setError(
                'Дубликация данных. Пожалуйста, проверьте введенные значения.',
              )
            } else {
              throw new Error(`status err ${res}`)
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
        await deleteData(id, token).then(res => {
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

  return JSON.stringify(mask) === JSON.stringify(data) ? (
    <li className={styles.active}>
      <div className={styles.content}>
        {Object.keys(mask).map(key => (
          <span key={key}> {mask[key]} </span>
        ))}
      </div>
    </li>
  ) : isEditing ? (
    <li className={styles.not_active}>
      <h2>Редагування</h2>
      <Formik
        initialValues={data}
        validationSchema={validationSchema}
        onSubmit={onSubmit}
        onReset={handleReset}
      >
        <Form>
          {Object.keys(data).map(key => (
            <div key={key}>
              <span>
                <label htmlFor={key}>{mask[key]}</label>
              </span>
              <Field
                disabled={key.includes('id')}
                type='text'
                id={key}
                name={key}
                placeholder={data[key]}
              />
              <ErrorMessage
                name={key}
                component='p'
                className={styles.error_message}
              />
            </div>
          ))}
          <button type='submit'>Застосувати</button>
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
