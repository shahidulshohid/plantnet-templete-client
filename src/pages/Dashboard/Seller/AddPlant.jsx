import { Helmet } from 'react-helmet-async'
import AddPlantForm from '../../../components/Form/AddPlantForm'
import { imageUpload } from '../../../api/utils'
import useAuth from '../../../hooks/useAuth'
import { useState } from 'react'
import useAxiosSecure from '../../../hooks/useAxiosSecure'
import toast from 'react-hot-toast'

const AddPlant = () => {
  const {user} = useAuth()
  const axiosSecure = useAxiosSecure()

  const [uploadButtonText, setUploadButtonText] = useState({name:'Upload Button'})
  const [loading, setLoading] = useState(false)
  const handleSubmit = async(e) => {
    setLoading(true)
    e.preventDefault()
    const form = e.target 
    const name = form.name.value 
    const description = form.description.value
    const category = form.category.value 
    const price = parseFloat(form.price.value)
    const quantity = parseInt(form.quantity.value)
    const image = form.image.files[0]
    const imageUrl = await imageUpload(image)
    // user info 
    const seller = {
      name:user?.displayName,
      email:user?.email,
      image:user?.photoURL,
    }

    //create plant data object
    const plantData ={name,description,category,price, quantity,image:imageUrl, seller
    }

    // save plant in db
    try {
      // post request 
      await axiosSecure.post('/plants', plantData)
      toast.success('Data added successfully!')
    } catch (error) {
      console.log(error)
    }
    finally{
      setLoading(false)
    }
  }
  return (
    <div>
      <Helmet>
        <title>Add Plant | Dashboard</title>
      </Helmet>

      {/* Form */}
      <AddPlantForm handleSubmit={handleSubmit} uploadButtonText={uploadButtonText} setUploadButtonText={setUploadButtonText} loading={loading}/>
    </div>
  )
}

export default AddPlant
