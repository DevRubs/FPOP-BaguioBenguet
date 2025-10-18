import { useState, useEffect } from 'react'
import AdminPageHeader from '../../../components/AdminPageHeader'
import Modal from '../../../components/Modal'
import { api } from '../../../api.js'

// Status Badge Component
function StatusBadge({ status }) {
  const styles = {
    published: 'bg-emerald-100 text-emerald-800 border-emerald-200',
    draft: 'bg-yellow-100 text-yellow-800 border-yellow-200',
    cancelled: 'bg-rose-100 text-rose-800 border-rose-200'
  }
  
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${styles[status] || 'bg-gray-100 text-gray-800 border-gray-200'}`}>
      {status}
    </span>
  )
}

// Type Badge Component
function TypeBadge({ type }) {
  const styles = {
    health: 'bg-blue-100 text-blue-800',
    education: 'bg-purple-100 text-purple-800',
    community: 'bg-green-100 text-green-800',
    testing: 'bg-orange-100 text-orange-800',
    workshop: 'bg-indigo-100 text-indigo-800',
    seminar: 'bg-pink-100 text-pink-800',
    other: 'bg-gray-100 text-gray-800'
  }
  
  return (
    <span className={`inline-flex items-center px-2 py-1 rounded-md text-xs font-medium ${styles[type] || 'bg-gray-100 text-gray-800'}`}>
      {type}
    </span>
  )
}

export default function AdminEvents() {
  const [events, setEvents] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [showCreateForm, setShowCreateForm] = useState(false)
  const [editingEvent, setEditingEvent] = useState(null)
  const [status, setStatus] = useState('all')
  const [type, setType] = useState('all')
  const [search, setSearch] = useState('')

  // Fetch events with filters
  useEffect(() => {
    const fetchEvents = async () => {
      try {
        setLoading(true)
        setError(null)
        
        const params = new URLSearchParams()
        if (status !== 'all') params.append('status', status)
        if (type !== 'all') params.append('type', type)
        
        const response = await api.get(`/api/events/admin/all?${params.toString()}`)
        let filteredEvents = response.events || []
        
        // Client-side search filter
        if (search.trim()) {
          const searchLower = search.toLowerCase()
          filteredEvents = filteredEvents.filter(event => 
            event.title.toLowerCase().includes(searchLower) ||
            event.description?.toLowerCase().includes(searchLower) ||
            event.location.toLowerCase().includes(searchLower)
          )
        }
        
        setEvents(filteredEvents)
      } catch (err) {
        console.error('Failed to fetch events:', err)
        setError('Failed to load events')
      } finally {
        setLoading(false)
      }
    }

    fetchEvents()
  }, [status, type, search])

  const handleCreateEvent = async (eventData) => {
    try {
      const response = await api.post('/api/events', eventData)
      setEvents(prev => [response.event, ...prev])
      setShowCreateForm(false)
    } catch (err) {
      console.error('Failed to create event:', err)
      setError('Failed to create event')
    }
  }

  const handleUpdateEvent = async (id, eventData) => {
    try {
      const response = await api.put(`/api/events/${id}`, eventData)
      setEvents(prev => prev.map(event => event._id === id ? response.event : event))
      setEditingEvent(null)
    } catch (err) {
      console.error('Failed to update event:', err)
      setError('Failed to update event')
    }
  }

  const handleDeleteEvent = async (id) => {
    if (!confirm('Are you sure you want to delete this event?')) return
    
    try {
      await api.del(`/api/events/${id}`)
      setEvents(prev => prev.filter(event => event._id !== id))
    } catch (err) {
      console.error('Failed to delete event:', err)
      setError('Failed to delete event')
    }
  }

  return (
    <div>
      <AdminPageHeader 
        title="Events Management" 
        description="Create, edit, and manage events for the calendar." 
      />
      
      {/* Filter Card */}
      <div className="rounded-2xl border border-[#65A3FA] bg-white shadow-lg p-4 md:p-6 mb-6">
        <div className="flex flex-col sm:flex-row gap-3 sm:items-center">
          <div className="flex items-center gap-3">
            <label className="text-base md:text-lg font-extrabold text-slate-900">Status</label>
            <select 
              value={status} 
              onChange={(e) => setStatus(e.target.value)} 
              className="rounded-md border border-slate-300 bg-white px-3 py-2 text-sm"
            >
              <option value="all">All</option>
              <option value="published">Published</option>
              <option value="draft">Draft</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>
          <div className="flex items-center gap-3">
            <label className="text-base md:text-lg font-extrabold text-slate-900">Type</label>
            <select 
              value={type} 
              onChange={(e) => setType(e.target.value)} 
              className="rounded-md border border-slate-300 bg-white px-3 py-2 text-sm"
            >
              <option value="all">All</option>
              <option value="health">Health</option>
              <option value="education">Education</option>
              <option value="community">Community</option>
              <option value="testing">Testing</option>
              <option value="workshop">Workshop</option>
              <option value="seminar">Seminar</option>
              <option value="other">Other</option>
            </select>
          </div>
          <div className="flex items-center gap-3">
            <label className="text-base md:text-lg font-extrabold text-slate-900">Search</label>
            <input 
              value={search} 
              onChange={(e) => setSearch(e.target.value)} 
              placeholder="Title, description, location" 
              className="rounded-md border border-slate-300 bg-white px-3 py-2 text-sm w-64" 
            />
          </div>
          <div className="flex items-center gap-3 ml-auto">
            <button
              onClick={() => setShowCreateForm(true)}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium"
            >
              Create Event
            </button>
          </div>
        </div>
      </div>

      {/* Desktop/Tablet Table View */}
      <div className="hidden lg:block overflow-auto rounded-2xl border border-[#65A3FA] bg-white shadow-lg">
        <table className="min-w-full divide-y divide-slate-200">
          <thead className="bg-slate-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Event</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Date</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Location</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Type</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-slate-200">
            {loading ? (
              <tr>
                <td colSpan="6" className="px-6 py-8 text-center text-slate-500">
                  <div className="inline-block animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
                  <p className="mt-2">Loading events...</p>
                </td>
              </tr>
            ) : error ? (
              <tr>
                <td colSpan="6" className="px-6 py-8 text-center text-rose-600">{error}</td>
              </tr>
            ) : events.length === 0 ? (
              <tr>
                <td colSpan="6" className="px-6 py-8 text-center text-slate-500">No events found</td>
              </tr>
            ) : (
              events.map((event) => (
                <tr key={event._id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-medium text-slate-900">{event.title}</div>
                      {event.description && (
                        <div className="text-sm text-slate-500 truncate max-w-xs">{event.description}</div>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-900">
                    {new Date(event.date).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-900">
                    {event.location}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <TypeBadge type={event.type} />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <StatusBadge status={event.status} />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex space-x-2">
                      <button
                        onClick={() => setEditingEvent(event)}
                        className="inline-flex items-center px-3 py-1.5 text-xs font-semibold rounded-full border border-blue-200 bg-blue-50 text-blue-700 hover:bg-blue-100 hover:border-blue-300 transition-colors duration-200"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDeleteEvent(event._id)}
                        className="inline-flex items-center px-3 py-1.5 text-xs font-semibold rounded-full border border-red-200 bg-red-50 text-red-700 hover:bg-red-100 hover:border-red-300 transition-colors duration-200"
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Mobile Card View */}
      <div className="lg:hidden space-y-4">
        {loading && (
          <div className="rounded-2xl border border-[#65A3FA] bg-white shadow-lg p-6 text-center text-slate-500">
            <div className="inline-block animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
            <p className="mt-2">Loading events...</p>
          </div>
        )}
        {!loading && error && (
          <div className="rounded-2xl border border-[#65A3FA] bg-white shadow-lg p-6 text-center text-rose-600">
            {error}
          </div>
        )}
        {!loading && !error && events.length === 0 && (
          <div className="rounded-2xl border border-[#65A3FA] bg-white shadow-lg p-6 text-center text-slate-500">
            No events found
          </div>
        )}
        {events.map((event) => (
          <div key={event._id} className="rounded-2xl border border-[#65A3FA] bg-white shadow-lg p-4 space-y-3">
            {/* Header with title, date, and status */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
              <div className="flex-1">
                <h3 className="font-bold text-slate-900 text-lg">{event.title}</h3>
                <p className="text-sm text-slate-600">{new Date(event.date).toLocaleString()}</p>
              </div>
              <div className="flex items-center gap-2">
                <StatusBadge status={event.status} />
                <TypeBadge type={event.type} />
              </div>
            </div>

            {/* Event Details */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Location</label>
                <p className="text-sm text-slate-900">{event.location}</p>
              </div>
              {event.contactInfo && (
                <div>
                  <label className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Contact Info</label>
                  <p className="text-sm text-slate-900">{event.contactInfo}</p>
                </div>
              )}
            </div>

            {/* Description */}
            {event.description && (
              <div>
                <label className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Description</label>
                <p className="text-sm text-slate-700 whitespace-pre-wrap">{event.description}</p>
              </div>
            )}

            {/* Requirements */}
            {event.requirements && (
              <div>
                <label className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Requirements</label>
                <p className="text-sm text-slate-700 whitespace-pre-wrap">{event.requirements}</p>
              </div>
            )}

            {/* Actions */}
            <div className="pt-2 border-t border-slate-100">
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => setEditingEvent(event)}
                  className="flex-1 sm:flex-none rounded-full border border-blue-200 bg-blue-50 text-blue-700 px-4 py-2 text-sm font-semibold hover:bg-blue-100 hover:border-blue-300 transition-colors duration-200"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDeleteEvent(event._id)}
                  className="flex-1 sm:flex-none rounded-full border border-red-200 bg-red-50 text-red-700 px-4 py-2 text-sm font-semibold hover:bg-red-100 hover:border-red-300 transition-colors duration-200"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Create/Edit Event Modal */}
      <Modal
        open={showCreateForm || !!editingEvent}
        title={editingEvent ? 'Edit Event' : 'Create New Event'}
        size="lg"
        onClose={() => {
          setShowCreateForm(false)
          setEditingEvent(null)
        }}
      >
        <EventForm
          event={editingEvent}
          onSubmit={editingEvent ? 
            (data) => handleUpdateEvent(editingEvent._id, data) : 
            handleCreateEvent
          }
          onCancel={() => {
            setShowCreateForm(false)
            setEditingEvent(null)
          }}
        />
      </Modal>
    </div>
  )
}

// Event Form Component
function EventForm({ event, onSubmit, onCancel }) {
  const [formData, setFormData] = useState({
    title: event?.title || '',
    description: event?.description || '',
    date: event?.date ? new Date(event.date).toISOString().split('T')[0] : '',
    time: event?.date ? new Date(event.date).toTimeString().slice(0, 5) : '',
    location: event?.location || '',
    type: event?.type || 'community',
    status: event?.status || 'published',
    contactInfo: event?.contactInfo || '',
    requirements: event?.requirements || ''
  })

  const handleSubmit = (e) => {
    e.preventDefault()
    
    // Client-side validation
    if (formData.title.trim().length < 3) {
      alert('Title must be at least 3 characters long')
      return
    }
    
    if (formData.location.trim().length < 3) {
      alert('Location must be at least 3 characters long')
      return
    }
    
    // Combine date and time (use local timezone, not UTC)
    const eventDate = new Date(`${formData.date}T${formData.time}:00`)
    
    const eventData = {
      title: formData.title.trim(),
      description: formData.description.trim(),
      date: eventDate.toISOString(),
      location: formData.location.trim(),
      type: formData.type,
      status: formData.status,
      contactInfo: formData.contactInfo.trim(),
      requirements: formData.requirements.trim()
    }

    onSubmit(eventData)
  }

  return (
    <form onSubmit={handleSubmit} className="p-6 space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-700">Title *</label>
            <input
              type="text"
              required
              value={formData.title}
              onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
              className="mt-1 block w-full border border-slate-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-slate-700">Location *</label>
            <input
              type="text"
              required
              value={formData.location}
              onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
              className="mt-1 block w-full border border-slate-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-slate-700">Date *</label>
            <input
              type="date"
              required
              value={formData.date}
              onChange={(e) => setFormData(prev => ({ ...prev, date: e.target.value }))}
              className="mt-1 block w-full border border-slate-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-slate-700">Time *</label>
            <input
              type="time"
              required
              value={formData.time}
              onChange={(e) => setFormData(prev => ({ ...prev, time: e.target.value }))}
              className="mt-1 block w-full border border-slate-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-slate-700">Type</label>
            <select
              value={formData.type}
              onChange={(e) => setFormData(prev => ({ ...prev, type: e.target.value }))}
              className="mt-1 block w-full border border-slate-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="health">Health</option>
              <option value="education">Education</option>
              <option value="community">Community</option>
              <option value="testing">Testing</option>
              <option value="workshop">Workshop</option>
              <option value="seminar">Seminar</option>
              <option value="other">Other</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-slate-700">Status</label>
            <select
              value={formData.status}
              onChange={(e) => setFormData(prev => ({ ...prev, status: e.target.value }))}
              className="mt-1 block w-full border border-slate-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="draft">Draft</option>
              <option value="published">Published</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-slate-700">Description</label>
          <textarea
            value={formData.description}
            onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
            rows={3}
            className="mt-1 block w-full border border-slate-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-slate-700">Contact Info</label>
          <input
            type="text"
            value={formData.contactInfo}
            onChange={(e) => setFormData(prev => ({ ...prev, contactInfo: e.target.value }))}
            className="mt-1 block w-full border border-slate-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-slate-700">Requirements</label>
          <textarea
            value={formData.requirements}
            onChange={(e) => setFormData(prev => ({ ...prev, requirements: e.target.value }))}
            rows={2}
            className="mt-1 block w-full border border-slate-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
        
        <div className="flex justify-end space-x-3">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 border border-slate-300 rounded-md text-slate-700 hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            {event ? 'Update Event' : 'Create Event'}
          </button>
        </div>
      </form>
  )
}


