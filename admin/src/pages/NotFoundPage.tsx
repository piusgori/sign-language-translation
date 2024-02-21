import { Link } from "@mui/material"

const NotFoundPage = () => {
  return (
    <div style={{ width: '100%', height: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
        <p>Page not found</p>
        <Link component='a' href='/' underline="none">Home</Link>
    </div>
  )
}

export default NotFoundPage