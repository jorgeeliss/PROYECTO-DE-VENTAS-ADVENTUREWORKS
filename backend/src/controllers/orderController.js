const Order = require('../models/Order');
const OrderItem = require('../models/OrderItem');
const Product = require('../models/Product');

exports.createOrder = async (req, res) => {
  try {
    const { contactInfo, shippingInfo, items, totals } = req.body;

    if (!items || items.length === 0) {
      return res.status(400).json({ message: 'No items in the order' });
    }

    // Opcional: Validar aquí los totales contra la base de datos de productos para evitar fraude
    // Por simplicidad, tomamos los valores del frontend en este ejemplo, 
    // pero en un entorno real DEBEN calcularse en el backend buscando los precios de Product

    // 1. Crear el Order
    const newOrder = await Order.create({
      customerName: contactInfo.name,
      customerLastName: contactInfo.lastName,
      customerEmail: contactInfo.email,
      customerPhone: contactInfo.phone,
      shippingAddress: shippingInfo.address,
      shippingCity: shippingInfo.city,
      shippingState: shippingInfo.state,
      shippingZip: shippingInfo.zip,
      shippingCountry: shippingInfo.country,
      shippingMethod: shippingInfo.method,
      subtotal: totals.subtotal,
      taxes: totals.taxes,
      shippingCost: totals.shippingCost,
      totalAmount: totals.total
    });

    // 2. Crear los OrderItems
    const orderItemsData = items.map(item => ({
      orderId: newOrder.id,
      productId: item.id,
      quantity: item.quantity,
      priceAtPurchase: item.price,
      size: item.size || null
    }));

    await OrderItem.bulkCreate(orderItemsData);

    res.status(201).json({ 
      message: 'Order created successfully', 
      orderId: newOrder.id 
    });

  } catch (error) {
    console.error('Error creating order:', error);
    res.status(500).json({ message: 'Failed to create order', error: error.message });
  }
};

exports.getOrders = async (req, res) => {
  try {
    const orders = await Order.findAll({
      order: [['createdAt', 'DESC']],
      include: [
        {
          model: OrderItem,
          include: [
            {
              model: Product,
              attributes: ['name', 'category', 'image']
            }
          ]
        }
      ]
    });
    
    res.json(orders);
  } catch (error) {
    console.error('Error fetching orders:', error);
    res.status(500).json({ message: 'Failed to fetch orders', error: error.message });
  }
};
