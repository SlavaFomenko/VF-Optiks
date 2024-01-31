import { useEffect, useState } from 'react'
import { getCategory } from '../../api/categoryAPI'
import { getManufacturer } from '../../api/manufacturerAPI'
import { getProduct } from '../../api/productAPI'
import Filter from '../../components/filter/filter'
import ProductCard from '../../components/product-card/product-card'
import AdmSearchLine from '../../components/search-line-adm/search-line'
import { usePaginate } from '../../hooks/paginate'
import styles from './store.module.scss'
interface StorePageProps {}

interface Image {
  image_id: number
  image_url: string
}

type Gender = 'Чоловічі' | 'Жіночі' | 'Унісекс'

interface Product {
  id: number
  name: string
  category: string
  gender: Gender
  manufacturer: string
  country: string
  price: number
  quantity: number
  images: Image[] | [] // Массив изображений, который может быть пустым
}

const StorePage = ({}: StorePageProps): JSX.Element => {
  const pagination = usePaginate({ initialLimit: 17, initialPage: 1 })
  const [products, setProducts] = useState<Product[] | null>(null)
  const [id, setId] = useState<number | undefined>(undefined)
  const [name, setName] = useState<string | undefined>(undefined)
  const [category, setCategory] = useState<string[] | undefined>(undefined)
  const [gender, setGender] = useState<Gender[] | undefined>(undefined)
  const [manufacturer, setManufacturer] = useState<string[] | undefined>(undefined)
  const [country, setCountry] = useState<string[] | undefined>(undefined)
  const [priceFrom, setPriceFrom] = useState<number | undefined>(undefined)
  const [priceTo, setPriceTo] = useState<number | undefined>(undefined)
  const [priceInDescendingOrder, setPriceInDescendingOrder] = useState<boolean | undefined>(undefined)

  const [filterData, setFilterData] = useState<Record<string, string[]> | null>(null)

  const dependencies = [
    pagination.limit,
    pagination.page,
    id,
    name,
    category,
    gender,
    manufacturer,
    country,
    priceFrom,
    priceTo,
    priceInDescendingOrder,
  ]

  useEffect(() => {
    getProduct(
      pagination.page,
      pagination.limit,
      undefined,
      id,
      name,
      category,
      gender,
      manufacturer,
      country,
      priceFrom,
      priceTo,
      priceInDescendingOrder,
    ).then(res => {
      if (typeof res !== 'number') {
        setProducts(res)
      }
    })

    const data: Record<string, string[]> = {}

    getManufacturer('token').then(res => {
      if (typeof res !== 'number') {
        res.forEach(manufacturer => {
          const country = manufacturer.country
          const manufacturerName = manufacturer.name

          if (!data.hasOwnProperty('Країни')) {
            data['Країни'] = []
          }
          if (!data.hasOwnProperty('Виробники')) {
            data['Виробники'] = []
          }

          const uniqueCountriesSet = new Set(data['Країни'])
          const uniqueManufacturersSet = new Set(data['Виробники'])
          uniqueCountriesSet.add(country)
          uniqueManufacturersSet.add(manufacturerName)
          data['Країни'] = Array.from(uniqueCountriesSet)
          data['Виробники'] = Array.from(uniqueManufacturersSet)
        })
      }
    })

    getCategory('token').then(res => {
      if (typeof res !== 'number') {
        res.forEach(category => {
          const categoryName = category.name

          if (!data.hasOwnProperty('Категорія')) {
            data['Категорія'] = []
          }

          const uniqueCategorySet = new Set(data['Категорія'])
          uniqueCategorySet.add(categoryName)
          data['Категорія'] = Array.from(uniqueCategorySet)
        })
      }
      setFilterData(data)
    })
  }, dependencies)

  const addFilterProperties = (data: Record<string, string[]> | string, type: 'filter' | 'name') => {
    console.log(data);
  
    switch (type) {
      case 'filter':
        if (typeof data === 'object') {
          if ('Країни' in data) {
            setCountry(data['Країни']);
          }else{

            if(country !== undefined){
              setCountry(undefined);
            }
          }
          if ('Виробники' in data) {
            // console.log(data['Виробники']);
            
            setManufacturer(data['Виробники']);
          } else {
            if(manufacturer !== undefined){
              setManufacturer(undefined);
            }
          }
          if ('Категорія' in data) {
            setCategory(data['Категорія']);
          }else {
            if(category !== undefined){
              setCategory(undefined);
            }
          }
        }
        break;
      case 'name':
        if (typeof data === 'string') {
          setName(data)
        }
        break;
      default:
        console.log('switch default');
        break;
    }
  };

  return (
    <main className={styles.wrapper}>
      <div className={styles.filter}>
        <Filter options={filterData} setData={addFilterProperties} />
      </div>
      <section className={styles.product_card_wrapper}>
        <div className={styles.search_line}>
          <AdmSearchLine setData={addFilterProperties} />
        </div>
        <div className={styles.product_cards}>
          <ul className={styles.product_cards_list}>
            {products?.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </ul>
        </div>
      </section>
    </main>
  )
}

export default StorePage
