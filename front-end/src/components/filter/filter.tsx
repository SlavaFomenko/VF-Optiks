import { Field, Form, Formik, FormikHelpers } from 'formik'
import { useContext, useEffect, useState } from 'react'
import UserContext from '../../context/userContext'
import styles from './filter.module.scss'

interface PaginateState {
  limit: number;
  page: number;
  setLimit: (limit: number) => void;
  setPage: (page: number) => void;
}

interface FilterProps<T> {
  paginate?: PaginateState
  options: Record<string, T[]> | null
  // getData: (...args: any[]) => Promise<any>
  setData: (...args: any[]) => any // виправить  *****
}

interface resData {
  [key: string]: string[]
}

const Filter: React.FC<FilterProps<string>> = ({
  paginate,
  options,
  setData,
  // getData,
}): JSX.Element => {
  // const user = useContext(UserContext)
  // const [isSubmit, setIsSubmit] = useState<boolean>(false)
  // const [filter, setFilter] = useState<resData | null>(null)
  // const [data, setCurrentData] = useState<any[]| null>(null)

  const initializeFormValues = (
    options: Record<string, string[]>,
  ): Record<string, Record<string, boolean>> => {
    return Object.keys(options).reduce((acc, key) => {
      acc[key] = options[key].reduce((innerAcc, value) => {
        innerAcc[value as string] = false
        return innerAcc
      }, {} as Record<string, boolean>)
      return acc
    }, {} as Record<string, Record<string, boolean>>)
  }

  const onSubmit = async (values: any) => {
    // console.log(values)
    
    
    const data: { [key: string]: string[] } = {}
    let isAllProperties = true
    for (const prop in values) {
      for (const value in values[prop]) {
        if (values[prop][value]) {
          if (data.hasOwnProperty(prop)) {
            data[prop].push(value)
          } else {
            data[prop] = [value]
          }
        } else {
          isAllProperties = false
        }
      }
    }
    setData(data,'filter')
  }

  if (options === null) {
    return <></>
  }

  return (
    <Formik initialValues={initializeFormValues(options)} onSubmit={(values ) => onSubmit(values)}>
      <Form>
        <div className={styles.buttons}>
          <button className={styles.submit_btn} type='submit'>
            Застосувати фільтр
          </button>
          <button className={styles.submit_btn} type='reset'>
            Відмінити фільтр
          </button>
        </div>

        {Object.keys(options).map(property => (
          <div key={property} className={styles.filter}>
            <h3>{property}</h3>
            {options[property].map(value => (
              <div className={styles.input_block} key={value}>
                <Field
                  type='checkbox'
                  id={`${property}.${value}`}
                  name={`${property}.${value}`}
                />
                <label htmlFor={`${property}.${value}`}>{value}</label>
              </div>
            ))}
          </div>
        ))}
      </Form>
    </Formik>
  )
}

export default Filter
