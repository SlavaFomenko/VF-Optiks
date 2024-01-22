import { useContext, useEffect, useState } from 'react'
import { getProduct } from '../../api/productAPI'
import UserContext from '../../context/userContext'
import styles from './cart-card.module.scss'

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

interface CartCardProps {
  product_id: number
  quantity: number
}

const CartCard = ({ product_id, quantity }: CartCardProps): JSX.Element => {
  const [product, setProduct] = useState<Product | null>(null)
  const user = useContext(UserContext)
  useEffect(() => {
    if (user?.user) {
      getProduct(1, 1, user.user.token, product_id).then(res => {
        if (typeof res !== 'number') {
          setProduct(res[0])
        } else {
          console.error(res)
        }
      })
    }
  }, [])

  return (
    <li className={styles.wrapper}>
      {product ? (
        <div>
          {product.name} {quantity}{' '}
        </div>
      ) : (
        <></>
      )}
    </li>
  )
}

export default CartCard
