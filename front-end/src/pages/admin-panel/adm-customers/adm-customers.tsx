import styles from './adm-customers.module.scss'

import { useContext, useEffect, useState } from 'react'
import {
  deleteCustomer,
  getCustomer,
  patchCustomer,
  postCustomer,
} from '../../../api/customersAPI'
import AdmCreateEntity from '../../../components/adm-create-entity/adm-create-entity'
import EditingInput from '../../../components/editing-input/editing-input'
import Filter from '../../../components/filter/filter'
import AdmSearchLine from '../../../components/search-line-adm/search-line'
import UserContext from '../../../context/userContext'
import { usePaginate } from '../../../hooks/paginate'

interface CustomerState {
  customer_id: number | string
  login: string
  first_name: string
  last_name: string
  tel_number: string
  role: 'user' | 'admin'
}
interface data {
  ['Ролі']: string[]
}

const AdmCustomers = (): JSX.Element => {
  const [customers, setCustomers] = useState<CustomerState[] | null>(null)
  const [roles, setRoles] = useState<Record<string, string[]> | null>({
    ['Ролі']: ['admin', 'user'],
  })
  const user = useContext(UserContext)
  const paginate = usePaginate({ initialLimit: 10, initialPage: 1 })
  const [filterdata, setFilterData] = useState<data | undefined>(undefined)
  const [findName, setFindName] = useState<string | undefined>(undefined)

  useEffect(() => {
    // console.log(filterdata);
    if (user?.user) {
      console.log('adm-customer useEffect')
      // setCustomers(null)
      getCustomer(
        user?.user?.token,
        paginate.page,
        paginate.limit,
        undefined,
        findName,
        filterdata,
      ).then(res => {
        if (typeof res !== 'number') {
          console.log(res)
          if (customers !== null) {
            setCustomers([...res])
          } else {
            setCustomers([...res])
          }
        } else {
          setCustomers(null)
          console.error(`err + ${res}`)
        }
      })
    } else {
      console.error('Запит без токену')
    }
  }, [paginate.page, filterdata, findName])

  const addNewUser = (data: data | string, type: 'filter' | 'name') => {
    switch (type) {
      case 'filter':
        if (typeof data === 'object') {
          setFilterData(data)
        }
        break
      case 'name':
        console.log(data)
        if (typeof data === 'string') {
          setFindName(data)
          paginate.setPage(1)
        }
        if (data === undefined) {
          paginate.setPage(1)
          setFindName(undefined)
        }
        break
    }
  }

  return (
    <section className={styles.wrapper}>
      <div className={styles.header}>
        <h1>Користувачі</h1>
        <div className={styles.options_wrapper}>
          <AdmSearchLine setData={addNewUser} />
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
            paginate={paginate}
            setData={addNewUser}
            // getData={getCustomer}
          />
        </div>

        <ul className={styles.data_list}>
          <>
            <EditingInput
              mask={{
                customers_id: '№',
                login: 'Логін',
                first_name: 'Імʼя',
                last_name: 'Прізвище',
                tel_number: 'Номер телефону',
                role: 'Роль',
              }}
              dataProps={{
                customers_id: '№',
                login: 'Логін',
                first_name: 'Імʼя',
                last_name: 'Прізвище',
                tel_number: 'Номер телефону',
                role: 'Роль',
              }}
            />
            {Array.isArray(customers)
              ? customers.map(customer => (
                  <EditingInput
                    mask={{
                      customer_id: '№',
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

          {customers && customers?.length % paginate.limit === 0 ? (
            <li>
              <button
                onClick={() => {
                  if (paginate.page > 1) {
                    paginate.setPage(paginate.page - 1)
                  }
                }}
              >
                {'<-'}
              </button>
              <button onClick={() => paginate.setPage(paginate.page + 1)}>
                {'->'}
              </button>
            </li>
          ) : (
            <li>
              <button
                onClick={() => {
                  if (paginate.page > 1) {
                    paginate.setPage(paginate.page - 1)
                  }
                }}
              >
                {'<-'}
              </button>
            </li>
          )}
        </ul>
      </div>
    </section>
  )
}

export default AdmCustomers
