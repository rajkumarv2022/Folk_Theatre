import { Hono } from 'hono'
import {cors} from 'hono/cors'

// const app = new Hono()


type Bindings = {

  DB:D1Database;
}

const app: Hono<{Bindings:Bindings}> = new Hono();

app.use(
  '/*',
  cors(
    {
      origin: 'http://localhost:5173',
      allowMethods: ['POST','GET','OPTIONS','DELETE']
    }
  )

)

//sellers register

// app.post('/folk_reg/new',async (c) => {
//   const {name,email,password,address,phone_number,pincode} = await c.req.json();
//   const row = await c.env.DB.prepare(`SELECT * FROM sellers_signup WHERE email = ?`).bind(email).all();
//   const row2 = await c.env.DB.prepare(`SELECT * FROM buyers_signup WHERE email = ?`).bind(email).all();
//   if(row.results.length>0 || row2.results.length>0) 
//   {
//     return c.text("email already exists");
//   }
//   const {success} = await c.env.DB.prepare(`INSERT INTO sellers_signup (name,email,password,address,phone_number,pincode) VALUES (?,?,?,?,?,?);`).bind(name,email,password,address,phone_number,pincode).run();
//   if(success)
//   {
//     return c.text("success");
//   }
//   else
//   {
//     return c.text("failed");
//   }
// } )

app.post('/folk_reg/new',async (c) => {
  const {email,password,phone_number} = await c.req.json();
  const row = await c.env.DB.prepare(`SELECT * FROM sellers_signup WHERE email = ?`).bind(email).all();
  const row2 = await c.env.DB.prepare(`SELECT * FROM buyers_signup WHERE email = ?`).bind(email).all();
  if(row.results.length>0 || row2.results.length>0) 
  {
    return c.text("email already exists");
  }
  const {success} = await c.env.DB.prepare(`INSERT INTO sellers_signup (email,password,phone_number) VALUES (?,?,?);`).bind(email,password,phone_number).run();
  if(success)
  {
    return c.text("success");
  }
  else
  {
    return c.text("failed");
  }
} )

app.get('/folk_reg/get', async (c) => {
  const rows = await c.env.DB.prepare(`SELECT * FROM sellers_signup`).all();
  return c.json(rows);

}  )

//seller login
app.post('/folk_reg/login',async (c) => {
  const{email,password}=await c.req.json();
  const id = await c.env.DB.prepare(`SELECT seller_id FROM sellers_signup WHERE email=? AND password=?`).bind(email,password).all();
  if(id.results.length>0)
  {
      // return c.json(id.results);
      return c.json(id);
  }
  else
  {
    return c.text("failed");
  }

})

//buyer registration

app.post('/buyer_reg/new',async (c) => {
  const {name,email,password,address,phone_number,pincode} = await c.req.json();
  const row = await c.env.DB.prepare(`SELECT * FROM sellers_signup WHERE email = ?`).bind(email).all();
  const row2 = await c.env.DB.prepare(`SELECT * FROM buyers_signup WHERE email = ?`).bind(email).all();
  if(row.results.length>0 || row2.results.length>0) 
  {
    return c.text("email already exists");
  }
  const {success} = await c.env.DB.prepare(`INSERT INTO buyers_signup (name,email,password,address,phone_number,pincode) VALUES (?,?,?,?,?,?);`).bind(name,email,password,address,phone_number,pincode).run();
  if(success)
  {
    return c.text("success");
  }
  else
  {
    return c.text("failed");
  }
} )

//buyer login

app.post('/buyer_reg/login',async (c) => {
  const{email,password}=await c.req.json();
  const id = await c.env.DB.prepare(`SELECT buyer_id FROM buyers_signup WHERE email=? AND password=?`).bind(email,password).all();
  if(id.results.length>0)
  {
      return c.json(id.results);
  }
  else
  {
    return c.text("failed");
  }

})

//create folk
app.post('/folk/create',async (c) => {
  const{seller_id,name,profession,gender,price,imgurl} =await c.req.json();
  const {success} = await c.env.DB.prepare(`INSERT INTO cart (seller_id,name,profession,gender,price,imgurl) VALUES (?,?,?,?,?,?)`).bind(seller_id,name,profession,gender,price,imgurl).run();
  if(success)
  {
    return c.text("success");
  }
  else
  {
    return c.text("failed");
  }
})

//get cart by seller_id

app.get('/fork/cart/get-id',async (c) => {
  const{seller_id}=await c.req.json();
  const rows = await c.env.DB.prepare(`SELECT * FROM cart WHERE seller_id=?`).bind(seller_id).all();
  return c.json(rows);
} )

//get cart by proffosion
app.get('/fork/cart/get-profession',async (c) => {
  const{profession}=await c.req.json();
  const rows = await c.env.DB.prepare(`SELECT * FROM cart WHERE profession=?`).bind(profession).all();
  return c.json(rows);
} )

//get all cart
app.get('/fork/cart/get-all',async (c) => {
  const rows = await c.env.DB.prepare(`SELECT * FROM cart`).all();
  return c.json(rows);
} )

//delete cart by id

app.delete('/fork/cart/delete/:id',async (c) => {
  const id = await c.req.param('id');
  const {success} = await c.env.DB.prepare(`DELETE FROM cart WHERE cart_id=?`).bind(id).run();
  if(success)
  {
    return c.text("success");
  }
  else
  {
    return c.text("failed");
  }
} )

//delete all cart

app.delete('/fork/cart/delete-all/:id',async (c) => {
  const id = await c.req.param('id');
  const {success} = await c.env.DB.prepare(`DELETE FROM cart WHERE seller_id =?`).bind(id).run();
  if(success)
  {
    return c.text("success");
  }
  else
  {
    return c.text("failed");
  }
} )

//update cart by id
app.put('/fork/cart/update/:id', async (c) => {
  try {
    const id = c.req.param('id'); // Retrieve the id from the URL parameter
    const { profession } = await c.req.json(); // Retrieve the profession from the request body

    if (!id || !profession) {
      return c.json({ error: 'Invalid input' }, 400); // Return 400 Bad Request for invalid input
    }

    const { success } = await c.env.DB.prepare(`UPDATE cart SET profession = ? WHERE cart_id = ?`).bind(profession, id).run();

    if (success) {
      return c.text("success");
    } else {
      return c.text("failed");
    }
  } catch (error) {
    console.error(error);
    return c.json({ error: 'Failed to update cart' }, 500); // Return 500 Internal Server Error
  }
});

//book the folk
app.post('/fork/book/new',async (c) => {
  const {seller_id,buyer_id,profession,start_date,end_date} = await c.req.json();
  const {success} = await c.env.DB.prepare(`INSERT INTO bookings (seller_id,buyer_id,profession,start_date,end_date) VALUES (?,?,?,?,?);`).bind(seller_id,buyer_id,profession,start_date,end_date).run();
  if(success)
    {
      return c.text("success");
    }
  else
  {
    return c.text("failed");
  }
})

//update book status

app.put('/fork/book/update/:id', async (c) => {
  try {
    const id = c.req.param('id'); // Retrieve the id from the URL parameter
    const { status } = await c.req.json(); // Retrieve the status from the request body

    if (!id || !status) {
      return c.json({ error: 'Invalid input' }, 400); // Return 400 Bad Request for invalid input
    }

    const { success } = await c.env.DB.prepare(`UPDATE bookings SET status = ? WHERE booking_id = ?`).bind(status, id).run();

    if (success) {
      return c.text("success");
    } else {
      return c.text("failed");
    }
  } catch (error) {
    console.error(error);
    return c.json({ error: 'Failed to update book status' });
  }

});

//delete bookings
app.delete('/fork/book/delete/:id',async (c) => {
  const id = await c.req.param('id');
  const {success} = await c.env.DB.prepare(`DELETE FROM bookings WHERE booking_id=?`).bind(id).run();
  if(success)
  {
    return c.text("success");
  }
  else
  {
    return c.text("failed");
  }
} )

//add payment
app.post('/fork/payment',async (c) => {
  const{booking_id, amount, payment_date, payment_method} = await c.req.json();
  const{success} = await c.env.DB.prepare(`INSERT INTO payment (booking_id, amount, payment_date, payment_method) VALUES (?,?,?,?)`).bind(booking_id, amount, payment_date, payment_method).run();
  if(success)
  {
    return c.text("success");
  }
  else
  {
    return c.text("failed");
  }
})

//update payment status

app.put('/fork/payment/update/:id', async (c) => {
  try {
    const id = c.req.param('id'); // Retrieve the id from the URL parameter
    const { status } = await c.req.json(); // Retrieve the status from the request body

    if (!id || !status) {
      return c.json({ error: 'Invalid input' }, 400); // Return 400 Bad Request for invalid input
    }

    const { success } = await c.env.DB.prepare(`UPDATE payment SET status = ? WHERE payment_id = ?`).bind(status, id).run();

    if (success) {
      return c.text("success");
    } else {
      return c.text("failed");
    }
  } catch (error) {
    console.error(error);
    return c.json({ error: 'Failed to update payment status' });
  }
})

//add hisoty
app.post('/fork/history',async (c) => {
  const{buyer_id,seller_id,cart_id} = await c.req.json();
  const{success} = await c.env.DB.prepare(`INSERT INTO history (buyer_id,seller_id, cart_id) VALUES (?,?,?)`).bind(buyer_id, seller_id, cart_id).run();

  if(success)
  {
    return c.text("success");
  }
  else
  {
    return c.text("failed");
  }
})


app.get('/', (c) => {
  return c.text('Hello Hono!')
})

export default app
