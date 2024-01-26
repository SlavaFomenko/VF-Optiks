import { useFormik } from 'formik'
import { useContext, useEffect, useRef, useState } from 'react'
import * as Yup from 'yup'
import { changeProductInCart, getCart } from '../../api/cartAPI'
import { getProduct } from '../../api/productAPI'
import UserContext from '../../context/userContext'
import defaultImage from '../../images/header/eye_logo.png'
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
  images: Image[] | []
}

interface CartCardProps {
  product_id: number
  quantity: number
  order_id: number
  setOrderPrice: (...args: any) => any
}

const CartCard = ({ product_id, quantity, order_id, setOrderPrice }: CartCardProps): JSX.Element => {
  const [product, setProduct] = useState<Product | null>(null)
  const user = useContext(UserContext)
  const [price, setPrice] = useState<number>(0)
  const lastActionRef = useRef<string | null>(null)

  const formik = useFormik({
    initialValues: {
      quantity: quantity,
    },
    validationSchema: Yup.object().shape({
      quantity: Yup.number()
        .min(1, 'Кількість не може бути меньше 1')
        .max(product?.quantity || 10, 'Нажаль стільки немає в наявності')
        .required('Вкажіть кількість'),
    }),
    onSubmit: values => {
      switch (lastActionRef.current) {
        case 'decrement':
          changeProductInCart('token', order_id, product_id, values.quantity).then(res => {
            getCart(user!.user?.login!).then(res =>
              typeof res !== 'number' ? setOrderPrice(res[0].totalPrice) : console.error(res),
            )
          })
          setPrice(product?.price! * values.quantity)
          break
        case 'increment':
          changeProductInCart('token', order_id, product_id, values.quantity).then(res => {
            getCart(user!.user?.login!).then(res =>
              typeof res !== 'number' ? setOrderPrice(res[0].totalPrice) : console.error(res),
            )
          })
          setPrice(product?.price! * values.quantity)
          break
        case 'delete':
          changeProductInCart('token', order_id, product_id, 0).then(res => {
            getCart(user!.user?.login!).then(res =>
              typeof res !== 'number' ? setOrderPrice(res[0].totalPrice) : console.error(res),
            )
          })
          setProduct(null)
          break
        default:
          console.error('not found action')
          break
      }
    },
  })

  useEffect(() => {
    if (user?.user) {
      getProduct(1, 1, user.user.token, product_id).then(res => {
        if (typeof res !== 'number') {
          setProduct(res[0])
          setPrice(res[0].price)
        } else {
          console.error(res)
        }
      })
    }
  }, [product_id, user?.user])

  return product ? (
    <li className={styles.wrapper}>
      <div className={styles.product_info}>
        <div className={styles.image}>
          <img src={product.images.length ? product.images[0].image_url : defaultImage} alt={product.name} />
        </div>
        <div>{product.name}</div>
      </div>
      <div className={styles.order_info}>
        <div className={styles.quantity_change}>
          <form onSubmit={formik.handleSubmit}>
            <button
              disabled={formik.values.quantity < 2}
              type='button'
              onClick={() => {
                formik.setFieldValue('quantity', formik.values.quantity - 1)
                lastActionRef.current = 'decrement'
                formik.handleSubmit()
              }}
            >
              -
            </button>
            <input
              type='number'
              id='quantity'
              name='quantity'
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.quantity}
            />
            <button
              disabled={formik.values.quantity >= product.quantity}
              type='button'
              onClick={() => {
                formik.setFieldValue('quantity', formik.values.quantity + 1)
                lastActionRef.current = 'increment'
                formik.handleSubmit()
              }}
            >
              +
            </button>
            <button
              type='button'
              onClick={() => {
                lastActionRef.current = 'delete'
                formik.handleSubmit()
              }}
            >
              x
            </button>
            {price} грн.
          </form>
          {formik.touched.quantity && formik.errors.quantity && (
            <div style={{ color: 'red' }}>{formik.errors.quantity}</div>
          )}
        </div>
      </div>
    </li>
  ) : (
    <></>
  )
}

export default CartCard
