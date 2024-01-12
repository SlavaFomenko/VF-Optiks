import styles from './adm-manufacturers.module.scss'

import { useContext, useEffect, useState } from 'react'
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

interface ManufacturerState {
  manufacturer_id: number | string
  name: string
  country: string
}

const AdmManufacturers = (): JSX.Element => {
  const [manufacturers, setManufacturers] = useState<
    ManufacturerState[] | null
  >(null)
  const [countries,setCountries] = useState<Record<string, string[]> | null>(null)
  // const [error409,setError409]= useState<>
  // console.log(manufacturers)
  const user = useContext(UserContext)
  useEffect(() => {
    getManufacturer(user?.user?.token).then(res => {
      if (Array.isArray(res)) { // Проверяем, что res является массивом
        setManufacturers(res)
  
        const data: Record<string, string[]> = {}
  
        res.forEach((manufacturer: ManufacturerState) => {
          const country = manufacturer.country;
  
          if (!data.hasOwnProperty('Країни')) {
            data['Країни'] = [];
          }
  
          const uniqueCountriesSet = new Set(data['Країни']); 
          uniqueCountriesSet.add(country);
          data['Країни'] = Array.from(uniqueCountriesSet);
        })
  
        setCountries(data);
      } else {
        console.error("Ошибка при получении производителей:", res);
        // Можно добавить дополнительную обработку ошибок, если необходимо
      }
    })
  }, [])

  const addNewManufacturer = (data: ManufacturerState | ManufacturerState[]) => {
    const newArr: ManufacturerState[] | null = manufacturers
    if (newArr !== null) {
      console.log(data);
      if(Array.isArray(data)){
        setManufacturers(data)
      } else {
        setManufacturers([data])
      }
    } 
  }

  console.log(countries);
  
  
  return (
    <section className={styles.wrapper}>
      <div className={styles.header}>
        <h1>Виробники</h1>
        <div className={styles.options_wrapper}>
          <AdmSearchLine getData={getManufacturer} setData={setManufacturers} />
          <AdmCreateEntity
            mask={{ name: 'Назва', country: 'Країна' }}
            postAPI={postManufacturer}
            getData={addNewManufacturer}
          />
        </div>
      </div>
      <div className={styles.main}>
        <div className={styles.filter}>
          <Filter
            options={countries}
            setData={addNewManufacturer}
            getData={getManufacturer}
          />
        </div>

        <ul className={styles.data_list}>
          <>
            <EditingInput
              mask={{ manufacturer_id: '№', name: 'Назва', country: 'Країна' }}
              dataProps={{
                manufacturer_id: '№',
                name: 'Назва',
                country: 'Країна',
              }}
            />
            {Array.isArray(manufacturers)
              ? manufacturers.map(manufacturer => (
                  <EditingInput
                    mask={{
                      manufacturer_id: '№',
                      name: 'Назва',
                      country: 'Країна',
                    }}
                    key={manufacturer.manufacturer_id}
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

export default AdmManufacturers
