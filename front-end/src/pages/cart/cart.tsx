import { useContext, useEffect, useState } from 'react'
import { createPortal } from 'react-dom'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router'
import { closeCart } from '../../actions/cartActions'
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


const CartPage = (): JSX.Element | null => {
  const [cart, setCart] = useState<Order | null>(null)
  const { cart_data } = useSelector((state: any) => state.cart) //переробити типізацію
  const [orderPrice, setOrderPrice] = useState<number>(0)
  const dispatch = useDispatch()
  console.log(cart_data)

  const user = useContext(UserContext)
  const cartElem = document.getElementsByTagName('body')[0]
  const navigate = useNavigate()

  useEffect(() => {
    if (user?.user) {
      if (cart_data) {
        
        addToCart(user.user.customer_id, user.user.login, cart_data.product_id, 1).then(res => {
          if (typeof res !== 'number') {
            setCart(res[0])
            
            setOrderPrice(res[0].totalPrice)
          } else {
            console.log(res)
          }
        })
      } else {
        console.log('hello');
        getCart(user.user.login).then(res => {
          if (typeof res !== 'number') {
            console.log(res);
            
            setCart(res[0])
            // console.log(res[0].totalPrice);
            setOrderPrice(res[0].totalPrice)
          } else {
            console.log(res)
          }
        })
      }
    } else {
      dispatch(closeCart())
      navigate('/login')
    }
  }, [])
  // console.log(cart);

  const cartContent = (
    <main className={styles.wrapper}>
      <button className={styles.close_btn} onClick={() => dispatch(closeCart())}></button>
      <div className={styles.title}>
        <h1>Корзина</h1>
        <span className={styles.total_price}>Вартість {orderPrice} грн.</span>
      </div>
      <ul className={styles.product_list}>
        {cart ? (
          cart.cart.map(product => (
            <CartCard
              key={product.id_product}
              product_id={product.id_product}
              quantity={product.quantity}
              order_id={cart.id}
              setOrderPrice={setOrderPrice}
            />
          ))
        ) : (
          <></>
        )}
      </ul>
      <div className={styles.buttons}>
        <button className={styles.create_order_btn}> Оформити </button>
      </div>
    </main>
  )
  return createPortal(cartContent, cartElem!)
}

export default CartPage
