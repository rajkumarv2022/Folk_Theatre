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
      origin: 'http://localhot:5173',
      allowMethods: ['POST','GET','OPTIONS','DELETE']
    }
  )

)

//sellers register

app.post('/folk_reg/new',async (c) => {
  const {name,email,password,address,phone_number,pincode} = await c.req.json();
  const {success} = await c.env.DB.prepare(`INSERT INTO sellers_signup (name,email,password,address,phone_number,pincode) VALUES (?,?,?,?,?,?);`).bind(name,email,password,address,phone_number,pincode).run();
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

//
app.post('/folk_reg/login',async (c) => {
  const{email,password}=await c.req.json();
  const id = await c.env.DB.prepare(`SELECT seller_id FROM sellers_signup WHERE email=? AND password=?`).bind(email,password).all();
  if(id.results.length>0)
  {
      return c.json(id.results);
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
