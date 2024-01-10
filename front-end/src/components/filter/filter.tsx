import { Field, Form, Formik } from 'formik'
import styles from './filter.module.scss'

interface FilterProps<T> {
  options: Record<string, T[]> | null
  getData: (...args: any[]) => Promise<any>
  setData: (...args: any[]) => any
}

const Filter: React.FC<FilterProps<string>> = ({
  options,
  setData,
  getData,
}): JSX.Element => {
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
    const data: { [key: string]: string[] } = {}

    for (const prop in values) {
      for (const value in values[prop]) {
        if (values[prop][value]) {
          if (data.hasOwnProperty(prop)) {
            data[prop].push(value)
          } else {
            data[prop] = [value]
          }
        }
      }
    }
    console.log(data)
    // console.log('hello');

    await getData(undefined, undefined, data)
      .then(res => setData(res))
      .catch(err => console.log(err))
  }

  if (options === null) {
    return <></>
  }

  return (
    <Formik initialValues={initializeFormValues(options)} onSubmit={onSubmit}>
      <Form>
        <div className={styles.buttons}>
          <button className={styles.submit_btn} type='submit'>Застосувати фільтр</button>
          <button className={styles.submit_btn} type='reset'>Відмінити фільтр</button>
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
                <label htmlFor={`${property}.${value}`}>
                  {value}
                </label>
              </div>
            ))}
          </div>
        ))}
      </Form>
    </Formik>
  )
}

export default Filter
