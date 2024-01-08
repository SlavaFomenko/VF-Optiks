import { useEffect, useState } from 'react'
import { deleteCategory, getCategory, patchCategory } from '../../../api/categoryAPI'
import EditingInput from '../../../components/editing-input/editing-input'
import styles from './adm-categories.module.scss'

interface CategoriesState {
  category_id: number | string
  name: string
  description: string
}

const AdmCategories = (): JSX.Element => {
  const [categories, setCategories] = useState<CategoriesState[] | null>(null)
  // const [error409,setError409]= useState<>

  useEffect(() => {
    getCategory().then(res => {
      if (typeof res === 'number') {
        console.error(`status code ${res}`)
      } else {
        setCategories(res)
      }
    })
  }, [])

  return (
    <section className={styles.wrapper}>
      <ul className={styles.block}>
        {/* <li><span>N</span></li> */}
        <>
          <EditingInput
            mask={{ category_id: '№', name: 'Назва', description: 'Опис' }}
            dataProps={{ category_id: '№', name: 'Назва', description: 'Опис' }}
          />
          {categories !== null
            ? categories.map(category => (
                <EditingInput
                  mask={{
                    category_id: '№',
                    name: 'Назва',
                    description: 'Опис',
                  }}
                  key={category.category_id}
                  dataProps={category}
									patchData={patchCategory}
									deleteData={deleteCategory}
                />
              ))
            : ''}
        </>
      </ul>
    </section>
  )
}

export default AdmCategories
