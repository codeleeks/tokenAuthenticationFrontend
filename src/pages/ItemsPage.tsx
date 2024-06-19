import { Link, useLoaderData } from 'react-router-dom'
import { fetchWithAuth } from '../store/auth'

const ItemsPage = () => {
  const data = useLoaderData() as string[]
  
  return (
    <>
      <h2>Items Page</h2>
      {data && data.map((item) => <li>{item}</li>)}
      <Link to='/'>To Home</Link>
    </>
  )
}

export async function loader() {
  const data = await fetchWithAuth('items?email=codeleeks')
  return data
}

export default ItemsPage
