import YouthArchive from '../models/YouthArchive.js'

function detectPlatform(url) {
  const lower = url.toLowerCase()
  if (lower.includes('facebook')) return 'facebook'
  if (lower.includes('instagram')) return 'instagram'
  if (lower.includes('youtube')) return 'youtube'
  if (lower.includes('tiktok')) return 'tiktok'
  if (lower.includes('twitter') || lower.includes('x.com')) return 'twitter'
  return 'other'
}

// Public - Get all active archive items
export async function getArchiveItems(req, res, next) {
  try {
    const { page = 1, limit = 10 } = req.query
    const skip = (page - 1) * limit
    
    const items = await YouthArchive.find({ isActive: true })
      .sort({ date: -1 })
      .skip(skip)
      .limit(parseInt(limit))
      .select('title date url note platform createdAt')
    
    const total = await YouthArchive.countDocuments({ isActive: true })
    
    res.json({ 
      items, 
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit)
      }
    })
  } catch (err) {
    next(err)
  }
}

// Admin - Get all archive items (including inactive)
export async function adminGetAllItems(req, res, next) {
  try {
    const { page = 1, limit = 20, search, platform, isActive } = req.query
    const skip = (page - 1) * limit
    
    const filter = {}
    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: 'i' } },
        { note: { $regex: search, $options: 'i' } }
      ]
    }
    if (platform) filter.platform = platform
    if (isActive !== undefined) filter.isActive = isActive === 'true'
    
    const items = await YouthArchive.find(filter)
      .sort({ date: -1 })
      .skip(skip)
      .limit(parseInt(limit))
      .populate('createdBy', 'name email')
    
    const total = await YouthArchive.countDocuments(filter)
    
    res.json({ 
      items, 
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit)
      }
    })
  } catch (err) {
    next(err)
  }
}

// Admin - Create new archive item
export async function adminCreateItem(req, res, next) {
  try {
    const { title, date, url, note } = req.body
    
    if (!title || !date || !url) {
      return res.status(400).json({ message: 'title, date, and url are required' })
    }
    
    const platform = detectPlatform(url)
    
    const item = await YouthArchive.create({
      title,
      date: new Date(date),
      url,
      note: note || '',
      platform,
      createdBy: req.user.id
    })
    
    await item.populate('createdBy', 'name email')
    
    res.status(201).json({ item })
  } catch (err) {
    next(err)
  }
}

// Admin - Update archive item
export async function adminUpdateItem(req, res, next) {
  try {
    const { id } = req.params
    const { title, date, url, note, isActive } = req.body
    
    const updateData = {}
    if (title !== undefined) updateData.title = title
    if (date !== undefined) updateData.date = new Date(date)
    if (url !== undefined) {
      updateData.url = url
      updateData.platform = detectPlatform(url)
    }
    if (note !== undefined) updateData.note = note
    if (isActive !== undefined) updateData.isActive = isActive
    
    const item = await YouthArchive.findByIdAndUpdate(
      id, 
      updateData, 
      { new: true, runValidators: true }
    ).populate('createdBy', 'name email')
    
    if (!item) {
      return res.status(404).json({ message: 'Archive item not found' })
    }
    
    res.json({ item })
  } catch (err) {
    next(err)
  }
}

// Admin - Delete archive item
export async function adminDeleteItem(req, res, next) {
  try {
    const { id } = req.params
    
    const item = await YouthArchive.findByIdAndDelete(id)
    
    if (!item) {
      return res.status(404).json({ message: 'Archive item not found' })
    }
    
    res.json({ message: 'Archive item deleted successfully' })
  } catch (err) {
    next(err)
  }
}

// Admin - Get single archive item
export async function adminGetItem(req, res, next) {
  try {
    const { id } = req.params
    
    const item = await YouthArchive.findById(id).populate('createdBy', 'name email')
    
    if (!item) {
      return res.status(404).json({ message: 'Archive item not found' })
    }
    
    res.json({ item })
  } catch (err) {
    next(err)
  }
}
