import styles from './adm-customers.module.scss'

import { useContext, useEffect, useState } from 'react'
import {
  deleteCustomer,
  getCustomer,
  patchCustomer,
  postCustomer,
} from '../../../api/customersAPI'
import { getManufacturer } from '../../../api/manufacturerAPI'
import AdmCreateEntity from '../../../components/adm-create-entity/adm-create-entity'
import EditingInput from '../../../components/editing-input/editing-input'
import Filter from '../../../components/filter/filter'
import AdmSearchLine from '../../../components/search-line-adm/search-line'
import UserContext from '../../../context/userContext'

interface CustomerState {
  customer_id: number | string
  login: string
  first_name: string
  last_name: string
  tel_number: string
  role: 'user' | 'admin'
}

const AdmCustomers = (): JSX.Element => {
  const [customers, setCustomers] = useState<CustomerState[] | null>(null)
  const [roles, setRoles] = useState<Record<string, string[]> | null>(null)
  const user = useContext(UserContext)

  useEffect(() => {
    if (user?.user) {
      getCustomer(user?.user?.token).then(res => {
        if (Array.isArray(res)) {
          setCustomers(res)

          const data: Record<string, string[]> = {}

          res.forEach((customers: CustomerState) => {
            const role = customers.role

            if (!data.hasOwnProperty('Ролі')) {
              data['Ролі'] = []
            }

            const uniqueCountriesSet = new Set(data['Ролі'])
            uniqueCountriesSet.add(role)
            data['Ролі'] = Array.from(uniqueCountriesSet)
          })

          setRoles(data)
        } else {
          console.error('ошибка при получении пользователей:', res)
        }
      })
    } else {
      console.error('Запит без токену')
    }
  }, [])

  const addNewUser = (data: CustomerState | CustomerState[] | null) => {
    // console.log(data);
    
    if(data === null){
      setCustomers(null)
      return
    }
    if (Array.isArray(data)) {
      setCustomers(data)
    } else {
      setCustomers([data])
    }
  }


  console.log(roles);
  

  return (
    <section className={styles.wrapper}>
      <div className={styles.header}>
        <h1>Користувачі</h1>
        <div className={styles.options_wrapper}>
          <AdmSearchLine getData={getCustomer} setData={setCustomers} />
          <AdmCreateEntity
            mask={{
              login: 'Логін',
              first_name: 'Імʼя',
              last_name: 'Прізвище',
              tel_number: 'Номер телефону',
              password: 'Пароль',
              role: {
                valueName: 'Роль',
                admin: 'Адміністратор',
                user: 'Користувач',
              },
            }}
            postAPI={postCustomer}
            getData={addNewUser}
          />
        </div>
      </div>
      <div className={styles.main}>
        <div className={styles.filter}>
          <Filter
            options={roles}
            setData={addNewUser}
            getData={getCustomer}
          />
        </div>

        <ul className={styles.data_list}>
          <>
            <EditingInput
              mask={{
                login: 'Логін',
                first_name: 'Імʼя',
                last_name: 'Прізвище',
                tel_number: 'Номер телефону',
              }}
              dataProps={{
                customers_id:'№',
                login: 'Логін',
                first_name: 'Імʼя',
                last_name: 'Прізвище',
                tel_number: 'Номер телефону',
                role:'Роль'
              }}
            />
            {Array.isArray(customers)
              ? customers.map(customer => (
                  <EditingInput
                  mask={{
                    customer_id:'№',
                    login: 'Логін',
                    first_name: 'Імʼя',
                    last_name: 'Прізвище',
                    tel_number: 'Номер телефону',
                    password: 'Новий пароль',
                    role: {
                      valueName: 'Роль',
                      admin: 'Адміністратор',
                      user: 'Користувач',
                    },
                  }}
                    key={customer.customer_id}
                    dataProps={customer}
                    patchData={patchCustomer}
                    deleteData={deleteCustomer}
                  />
                ))
              : ''}
          </>
        </ul>
      </div>
    </section>
  )
}

export default AdmCustomers
