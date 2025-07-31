'use client'
import { useState, useEffect } from 'react'
import Head from 'next/head'
import Image from 'next/image'
import Masonry from 'react-masonry-css'
import { savePin, getPins, searchPins } from '../utils/pinUtils'

export default function Home() {
  const [pins, setPins] = useState([])
  const [searchQuery, setSearchQuery] = useState('')
  const [showUploadForm, setShowUploadForm] = useState(false)
  const [newPin, setNewPin] = useState({
    title: '',
    description: '',
    tags: '',
    image: null
  })

  // Load pins on initial render
  useEffect(() => {
    const loadedPins = getPins()
    setPins(loadedPins)
  }, [])

  // Handle search
  useEffect(() => {
    if (searchQuery) {
      const results = searchPins(searchQuery)
      setPins(results)
    } else {
      setPins(getPins())
    }
  }, [searchQuery])

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setNewPin(prev => ({ ...prev, [name]: value }))
  }

  const handleImageChange = (e) => {
    setNewPin(prev => ({ ...prev, image: e.target.files[0] }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const savedPin = await savePin(newPin)
      setPins(prev => [savedPin, ...prev])
      setNewPin({
        title: '',
        description: '',
        tags: '',
        image: null
      })
      setShowUploadForm(false)
    } catch (error) {
      console.error('Upload failed:', error)
    }
  }

  return (
    <div className="min-h-screen bg-[#f8f4ed]">
      <Head>
        <title>Zoero - Image Sharing</title>
      </Head>

      <header className="sticky top-0 z-10 bg-white shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex flex-col items-center">
            <Image 
              src="/zoero-banner.jpg" 
              alt="Zoero Banner"
              width={800}
              height={200}
              className="mb-4 rounded-lg"
            />
            <div className="w-full max-w-2xl">
              <input
                type="text"
                placeholder="Search by title or tags..."
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#8b5a2b]"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <button 
              onClick={() => setShowUploadForm(!showUploadForm)}
              className="mt-4 px-6 py-2 bg-[#8b5a2b] text-white rounded-lg hover:bg-[#6d4a2b] transition"
            >
              {showUploadForm ? 'Cancel' : 'Upload Image'}
            </button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {showUploadForm && (
          <div className="mb-8 p-6 bg-white rounded-lg shadow-md">
            <h2 className="text-2xl font-bold mb-4 text-[#5a3921]">Upload New Image</h2>
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label className="block text-gray-700 mb-2">Title</label>
                <input
                  type="text"
                  name="title"
                  value={newPin.title}
                  onChange={handleInputChange}
                  className="w-full p-2 border rounded"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 mb-2">Description</label>
                <textarea
                  name="description"
                  value={newPin.description}
                  onChange={handleInputChange}
                  className="w-full p-2 border rounded"
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 mb-2">Tags (comma separated)</label>
                <input
                  type="text"
                  name="tags"
                  value={newPin.tags}
                  onChange={handleInputChange}
                  className="w-full p-2 border rounded"
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 mb-2">Image</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="w-full p-2 border rounded"
                  required
                />
              </div>
              <button
                type="submit"
                className="px-4 py-2 bg-[#8b5a2b] text-white rounded hover:bg-[#6d4a2b]"
              >
                Upload
              </button>
            </form>
          </div>
        )}

        <Masonry
          breakpointCols={{
            default: 4,
            1100: 3,
            700: 2,
            500: 1
          }}
          className="flex -ml-4 w-auto"
          columnClassName="pl-4 bg-clip-padding"
        >
          {pins.map((pin) => (
            <div key={pin.id} className="mb-4 break-inside-avoid">
              <div className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transition">
                <img
                  src={`/uploads/${pin.imageUrl}`}
                  alt={pin.title}
                  className="w-full h-auto object-cover"
                  loading="lazy"
                />
                <div className="p-4">
                  <h3 className="font-bold text-lg text-[#5a3921]">{pin.title}</h3>
                  <p className="text-gray-600 mt-1">{pin.description}</p>
                  <div className="mt-2 flex flex-wrap gap-1">
                    {pin.tags.split(',').map((tag, i) => (
                      <span key={i} className="text-xs bg-[#e8d5b5] text-[#5a3921] px-2 py-1 rounded">
                        {tag.trim()}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </Masonry>
      </main>

      <footer className="bg-[#5a3921] text-white py-6">
        <div className="container mx-auto px-4 text-center">
          <p>Zoero — built by Fizrexx, with help from Lefthon & Atha. Funded by Dana.</p>
        </div>
      </footer>
    </div>
  )
    }
