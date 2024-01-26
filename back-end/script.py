import sys
import json

import telebot

json_data = sys.stdin.read()

bot = telebot.TeleBot('6950523961:AAFUylabHbTYvUfQZBrxX8lAnRphjBuIWL4')

usernames = ["799593589"]

data = json.loads(json_data)

order_str = (
    f"Нове замовлення !!!\n"
    f"______________________________\n"
    f"Данні про замовлення\n\n"
    f"Номер замовлення - {data['order_id']}\n"
    f"Дата замовлення {data['order_date'][:10]} {data['order_date'][11:19]}\n"
    f"Адреса:\n"
    f"Місто - {data['address']['city']}\n"
    f"Вулиця - {data['address']['street']}\n"
    f"Будинок - {data['address']['house']}\n"
    f"Індекс - {data['address']['zip_code']}\n"
    f"Тип доставки - {data['delivery_type']}\n\n"
    f"Сума замовлення {data['total_price']} грн\n"
    f"__________________________________\n\n"
    f"Данні про користувача\n\n"
    f"Ім'я - {data['customer_info']['first_name']}\n"
    f"Прізвище - {data['customer_info']['last_name']}\n"
    f"Номер телефону - {data['customer_info']['tel_number']}'\n"
    f"___________________________________\n\n"
    f"Товари\n\n"
    + "\n".join(
        [
            f"{index}. {product['product_name']},\n   Кількість - {product['quantity']}\n   Ціна - {product['subtotal']} грн\n"
            for index, product in enumerate(data['products'], start=1)
        ]
    )
)

# print(order_str)




for username in usernames:
    try:
        bot.send_message(username, order_str)
        print(f"Message sent to {username}")
    except Exception as e:
        print(f"Error sending message to {username}: {str(e)}")

print(data)

print(json.dumps({"result": "success"}))
