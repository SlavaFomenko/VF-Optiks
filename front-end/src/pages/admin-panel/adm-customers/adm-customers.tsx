import styles from './adm-customers.module.scss'

import { useContext, useEffect, useState } from 'react'
import { getCustomer, postCustomer } from '../../../api/customersAPI'
import {
	deleteManufacturer,
	getManufacturer,
	patchManufacturer,
	postManufacturer,
} from '../../../api/manufacturerAPI'
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

  const addNewUser = (data: CustomerState) => {
    const newArr: CustomerState[] | null = customers
    if (newArr !== null) {
      console.log(data)
      setCustomers([data])
    }
  }
  // alert('hello')
  // console.log(customers);

  return (
    <section className={styles.wrapper}>
      <div className={styles.header}>
        <h1>Користувачі</h1>
        <div className={styles.options_wrapper}>
          <AdmSearchLine getData={getManufacturer} setData={setCustomers} />
          <AdmCreateEntity
            mask={{ 
						login: 'Логін', 
						first_name: 'Імʼя',
						last_name: 'Прізвище',
						tel_number: 'Номер телефону',
            password:'Пароль',
						role:{
							valueName:"Роль",
							admin:'Адміністратор',
							user:'Користувач'}}}
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
            getData={getManufacturer}
          />
        </div>

        <ul className={styles.data_list}>
          <>
            <EditingInput
              mask={{ manufacturer_id: '№', name: 'Назва', role: 'Країна' }}
              dataProps={{
                manufacturer_id: '№',
                name: 'Назва',
                role: 'Країна',
              }}
            />
            {Array.isArray(customers)
              ? customers.map(manufacturer => (
                  <EditingInput
                    mask={{
                      manufacturer_id: '№',
                      name: 'Назва',
                      role: 'Країна',
                    }}
                    key={manufacturer.customer_id}
                    dataProps={manufacturer}
                    patchData={patchManufacturer}
                    deleteData={deleteManufacturer}
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
