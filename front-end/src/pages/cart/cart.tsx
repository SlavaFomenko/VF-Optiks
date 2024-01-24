import { useContext, useEffect, useState } from 'react'
import { createPortal } from 'react-dom'
import { useSelector } from 'react-redux'
import { addToCart, getCart } from '../../api/cartAPI'
import CartCard from '../../components/cart-card/cart-card'
import UserContext from '../../context/userContext'
import styles from './cart.module.scss'

interface Order {
  id: number
  customer_id: number
  customerLogin: string
  status: string
  address: string | null
  deliveryType: string | null
  createOrderDate: string
  totalPrice: number
  cart: CartItem[]
}

interface CartItem {
  name: string
  price: number
  quantity: number
  id_product: number
}

interface CartPageProps {
  product_id?: number
  quantity?: number
}

const CartPage = ({ product_id }: CartPageProps): JSX.Element | null => {
  const [cart, setCart] = useState<Order | null>(null)
  const { cart_data } = useSelector((state: any) => state.cart)
  console.log(cart_data)

  const user = useContext(UserContext)
  const cartElem = document.getElementById('cart')

  console.log(product_id)

  // console.log(user)

  useEffect(() => {
    if (user?.user) {
      if (cart_data) {
        // console.log('hello');
        addToCart(user.user.customer_id, user.user.login, cart_data.product_id, 1).then(res => {
          if (typeof res !== 'number') {
            // console.log(res);
            setCart(res[0])
          } else {
            console.log(res)
          }
        })
      } else {
        getCart(user.user.login).then(res => {
          if (typeof res !== 'number') {
            // console.log(res);
            setCart(res[0])
          } else {
            console.log(res)
          }
          // setCart(res[0])
        })
      }
    }
  }, [])

  // Создайте контейнер для содержимого корзины
  const cartContent = (
    <main className={styles.wrapper}>
      <h1>Корзина</h1>
      <ul>
        {cart ? (
          cart.cart.map(product => (
            <CartCard key={product.id_product} product_id={product.id_product} quantity={product.quantity} />
          ))
        ) : (
          <></>
        )}
      </ul>
    </main>
  )

  return createPortal(cartContent, cartElem!)
}

export default CartPage
