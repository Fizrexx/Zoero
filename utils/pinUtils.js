import fs from 'fs'
import path from 'path'

const pinsFilePath = path.join(process.cwd(), 'data', 'pins.json')
const uploadsDir = path.join(process.cwd(), 'public', 'uploads')

// Ensure uploads directory exists
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true })
}

export function getPins() {
  try {
    const pinsData = fs.readFileSync(pinsFilePath, 'utf8')
    return JSON.parse(pinsData)
  } catch (error) {
    console.error('Error reading pins data:', error)
    return []
  }
}

export function searchPins(query) {
  const pins = getPins()
  const lowerQuery = query.toLowerCase()
  return pins.filter(pin => 
    pin.title.toLowerCase().includes(lowerQuery) || 
    pin.tags.toLowerCase().includes(lowerQuery)
}

export async function savePin(pinData) {
  try {
    const pins = getPins()
    const timestamp = Date.now()
    const imageExt = pinData.image.name.split('.').pop()
    const imageName = `image-${timestamp}.${imageExt}`
    const imagePath = path.join(uploadsDir, imageName)

    // Save image file
    const arrayBuffer = await pinData.image.arrayBuffer()
    const buffer = Buffer.from(arrayBuffer)
    fs.writeFileSync(imagePath, buffer)

    // Create new pin object
    const newPin = {
      id: timestamp.toString(),
      title: pinData.title,
      description: pinData.description,
      tags: pinData.tags,
      imageUrl: imageName,
      createdAt: new Date().toISOString()
    }

    // Update pins.json
    const updatedPins = [newPin, ...pins]
    fs.writeFileSync(pinsFilePath, JSON.stringify(updatedPins, null, 2))

    return newPin
  } catch (error) {
    console.error('Error saving pin:', error)
    throw error
  }
                     }
