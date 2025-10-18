import Event from '../models/Event.js'
import { validateEventData } from '../utils/validators.js'

// Get all published events (public endpoint)
export async function getEvents(req, res, next) {
  try {
    const { type, status = 'published', limit = 50, page = 1 } = req.query
    
    const filter = { status }
    if (type && ['health', 'education', 'community', 'testing', 'workshop', 'seminar', 'other'].includes(type)) {
      filter.type = type
    }

    const skip = (parseInt(page) - 1) * parseInt(limit)
    const events = await Event.find(filter)
      .populate('createdBy', 'name')
      .sort({ date: 1 })
      .skip(skip)
      .limit(parseInt(limit))

    const total = await Event.countDocuments(filter)
    
    res.json({
      events,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / parseInt(limit))
      }
    })
  } catch (err) {
    next(err)
  }
}

// Get events for calendar view (optimized for calendar display)
export async function getEventsForCalendar(req, res, next) {
  try {
    const { startDate, endDate, type } = req.query
    
    if (!startDate || !endDate) {
      return res.status(400).json({ message: 'startDate and endDate are required' })
    }

    const filter = { 
      status: 'published',
      date: { 
        $gte: new Date(startDate), 
        $lte: new Date(endDate) 
      }
    }
    
    if (type && ['health', 'education', 'community', 'testing', 'workshop', 'seminar', 'other'].includes(type)) {
      filter.type = type
    }

    const events = await Event.find(filter)
      .select('title date location type description')
      .sort({ date: 1 })

    res.json({ events })
  } catch (err) {
    next(err)
  }
}

// Get single event
export async function getEvent(req, res, next) {
  try {
    const { id } = req.params
    const event = await Event.findById(id).populate('createdBy', 'name email')
    
    if (!event) {
      return res.status(404).json({ message: 'Event not found' })
    }
    
    res.json({ event })
  } catch (err) {
    next(err)
  }
}

// Create event (admin only)
export async function createEvent(req, res, next) {
  try {
    const eventData = req.body
    
    // Validate required fields
    const validation = validateEventData(eventData)
    if (!validation.isValid) {
      return res.status(400).json({ message: validation.message })
    }

    const event = await Event.create({
      ...eventData,
      createdBy: req.user.id
    })

    await event.populate('createdBy', 'name')
    res.status(201).json({ event })
  } catch (err) {
    next(err)
  }
}

// Update event (admin only)
export async function updateEvent(req, res, next) {
  try {
    const { id } = req.params
    const updateData = req.body

    // Validate if data is provided
    if (Object.keys(updateData).length > 0) {
      const validation = validateEventData(updateData, true)
      if (!validation.isValid) {
        return res.status(400).json({ message: validation.message })
      }
    }

    const event = await Event.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true }
    ).populate('createdBy', 'name')

    if (!event) {
      return res.status(404).json({ message: 'Event not found' })
    }

    res.json({ event })
  } catch (err) {
    next(err)
  }
}

// Delete event (admin only)
export async function deleteEvent(req, res, next) {
  try {
    const { id } = req.params
    const event = await Event.findByIdAndDelete(id)

    if (!event) {
      return res.status(404).json({ message: 'Event not found' })
    }

    res.json({ message: 'Event deleted successfully' })
  } catch (err) {
    next(err)
  }
}

// Admin: Get all events with filters
export async function adminGetEvents(req, res, next) {
  try {
    const { 
      status, 
      type, 
      createdBy, 
      startDate, 
      endDate,
      limit = 50, 
      page = 1 
    } = req.query
    
    const filter = {}
    
    if (status && ['draft', 'published', 'cancelled'].includes(status)) {
      filter.status = status
    }
    
    if (type && ['health', 'education', 'community', 'testing', 'workshop', 'seminar', 'other'].includes(type)) {
      filter.type = type
    }
    
    if (createdBy) {
      filter.createdBy = createdBy
    }
    
    if (startDate && endDate) {
      filter.date = { 
        $gte: new Date(startDate), 
        $lte: new Date(endDate) 
      }
    }

    const skip = (parseInt(page) - 1) * parseInt(limit)
    const events = await Event.find(filter)
      .populate('createdBy', 'name email role')
      .sort({ date: 1 })
      .skip(skip)
      .limit(parseInt(limit))

    const total = await Event.countDocuments(filter)
    
    res.json({
      events,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / parseInt(limit))
      }
    })
  } catch (err) {
    next(err)
  }
}
