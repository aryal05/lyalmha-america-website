import express from 'express'
import { QueryHelper } from '../utils/queryHelper.js'
import { authenticateToken } from '../middleware/auth.js'
import crypto from 'crypto'

const router = express.Router()

// Generate unique token
const generateToken = () => {
  const prefix = 'LAG'
  const year = new Date().getFullYear()
  const random = crypto.randomBytes(4).toString('hex').toUpperCase()
  return `${prefix}-${year}-${random}`
}

// POST submit membership registration (public)
router.post('/register', async (req, res) => {
  try {
    const {
      first_name,
      last_name,
      full_address,
      city,
      zipcode,
      contact_no,
      email,
      family_id,
      referred_by,
      referral_name,
      referral_contact
    } = req.body

    // Validate required fields
    if (!first_name || !last_name || !email || !contact_no) {
      return res.status(400).json({
        success: false,
        error: 'First name, last name, email, and contact number are required'
      })
    }

    // Check if email already registered
    const existing = await QueryHelper.get(
      'SELECT id FROM membership_registrations WHERE email = ?',
      [email]
    )

    if (existing) {
      return res.status(400).json({
        success: false,
        error: 'This email is already registered for membership'
      })
    }

    // Generate unique token
    const token = generateToken()

    // Insert registration
    const result = await QueryHelper.run(`
      INSERT INTO membership_registrations 
      (first_name, last_name, full_address, city, zipcode, contact_no, email, family_id, referred_by, referral_name, referral_contact, membership_token, status)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'pending')
    `, [first_name, last_name, full_address, city, zipcode, contact_no, email, family_id, referred_by, referral_name, referral_contact, token])

    const newRegistration = await QueryHelper.get(
      'SELECT * FROM membership_registrations WHERE id = ?',
      [result.lastID]
    )

    // Send confirmation email (simplified - you can integrate proper email service)
    console.log(`📧 Membership confirmation email would be sent to ${email} with token: ${token}`)

    res.status(201).json({
      success: true,
      data: newRegistration,
      message: `Registration successful! Your membership token is: ${token}. Please save this for your records.`
    })
  } catch (error) {
    console.error('Error creating membership registration:', error)
    res.status(500).json({ success: false, error: error.message })
  }
})

// Admin routes - require authentication
router.use(authenticateToken)

// GET all registrations
router.get('/', async (req, res) => {
  try {
    const registrations = await QueryHelper.all(
      'SELECT * FROM membership_registrations ORDER BY created_at DESC'
    )
    res.json({ success: true, data: registrations })
  } catch (error) {
    res.status(500).json({ success: false, error: error.message })
  }
})

// GET registration by ID
router.get('/:id', async (req, res) => {
  try {
    const registration = await QueryHelper.get(
      'SELECT * FROM membership_registrations WHERE id = ?',
      [req.params.id]
    )
    if (!registration) {
      return res.status(404).json({ success: false, error: 'Registration not found' })
    }
    res.json({ success: true, data: registration })
  } catch (error) {
    res.status(500).json({ success: false, error: error.message })
  }
})

// PUT update registration status
router.put('/:id/status', async (req, res) => {
  try {
    const { status } = req.body
    const validStatuses = ['pending', 'approved', 'rejected', 'paid']

    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid status. Must be: pending, approved, rejected, or paid'
      })
    }

    await QueryHelper.run(
      'UPDATE membership_registrations SET status = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?',
      [status, req.params.id]
    )

    const updated = await QueryHelper.get(
      'SELECT * FROM membership_registrations WHERE id = ?',
      [req.params.id]
    )

    res.json({ success: true, data: updated })
  } catch (error) {
    res.status(500).json({ success: false, error: error.message })
  }
})

// DELETE registration
router.delete('/:id', async (req, res) => {
  try {
    const registration = await QueryHelper.get(
      'SELECT * FROM membership_registrations WHERE id = ?',
      [req.params.id]
    )

    if (!registration) {
      return res.status(404).json({ success: false, error: 'Registration not found' })
    }

    await QueryHelper.run('DELETE FROM membership_registrations WHERE id = ?', [req.params.id])

    res.json({ success: true, message: 'Registration deleted successfully' })
  } catch (error) {
    res.status(500).json({ success: false, error: error.message })
  }
})

// GET statistics
router.get('/stats/summary', async (req, res) => {
  try {
    const total = await QueryHelper.get('SELECT COUNT(*) as count FROM membership_registrations')
    const pending = await QueryHelper.get('SELECT COUNT(*) as count FROM membership_registrations WHERE status = ?', ['pending'])
    const approved = await QueryHelper.get('SELECT COUNT(*) as count FROM membership_registrations WHERE status = ?', ['approved'])
    const paid = await QueryHelper.get('SELECT COUNT(*) as count FROM membership_registrations WHERE status = ?', ['paid'])

    res.json({
      success: true,
      data: {
        total: total.count,
        pending: pending.count,
        approved: approved.count,
        paid: paid.count
      }
    })
  } catch (error) {
    res.status(500).json({ success: false, error: error.message })
  }
})

export default router
