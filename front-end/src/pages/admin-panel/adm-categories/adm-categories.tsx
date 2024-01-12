import { useEffect, useState } from 'react'
import {
  deleteCategory,
  getCategory,
  patchCategory,
  postCategory,
} from '../../../api/categoryAPI'
import AdmCreateEntity from '../../../components/adm-create-entity/adm-create-entity'
import EditingInput from '../../../components/editing-input/editing-input'
import AdmSearchLine from '../../../components/search-line-adm/search-line'
import styles from './adm-categories.module.scss'

interface CategoriesState {
  category_id: number | string
  name: string
  description: string
}

const AdmCategories = (): JSX.Element => {
  const [categories, setCategories] = useState<CategoriesState[] | null>(null)
  // const [error409,setError409]= useState<>
  console.log(categories)
  useEffect(() => {
    getCategory('token').then(res => {
      if (typeof res === 'number') {
        console.error(`status code ${res}`)
      } else {
        setCategories(res)
      }
    })
  }, [])

  const addNewCategory = (data: CategoriesState) => {
    const newArr: CategoriesState[] | null = categories

    if (newArr !== null) {
      const updatedArr = [...newArr, data]
      setCategories(updatedArr)
    } else {
      setCategories([data])
    }
  }

  return (
    <section className={styles.wrapper}>
      <div className={styles.header}>
        <h1>Категорії</h1>
        <div className={styles.options_wrapper}>
          <AdmSearchLine getData={getCategory} setData={setCategories} />
          <AdmCreateEntity
            mask={{ name: 'Назва', description: 'Опис' }}
            postAPI={postCategory}
            getData={addNewCategory}
          />
        </div>
        
      </div>
      <ul className={styles.block}>
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
