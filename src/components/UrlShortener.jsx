import React, { useState } from 'react'
import {
  Container,
  Paper,
  Typography,
  TextField,
  Button,
  Grid,
  Box,
  Card,
  CardContent,
  IconButton,
  Alert,
  Chip
} from '@mui/material'
import AddIcon from '@mui/icons-material/Add'
import RemoveIcon from '@mui/icons-material/Remove'
import ContentCopyIcon from '@mui/icons-material/ContentCopy'
import LoggingMiddleware from './loggingmiddleware'

const UrlShortener = ({ urls, setUrls }) => {
  const [urlForms, setUrlForms] = useState([{ longUrl: '', validity: '', shortCode: '' }])
  const [errors, setErrors] = useState([])
  const [success, setSuccess] = useState('')

  const validateUrl = (url) => {
    try {
      new URL(url)
      return true
    // eslint-disable-next-line no-unused-vars
    } catch (e) {
      return false
    }
  }

  const generateShortCode = () => {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
    let result = ''
    for (let i = 0; i < 6; i++) {
      result += characters.charAt(Math.floor(Math.random() * characters.length))
    }
    return result
  }

  const handleInputChange = (index, field, value) => {
    const newForms = [...urlForms]
    newForms[index][field] = value
    setUrlForms(newForms)
  }

  const addUrlForm = () => {
    if (urlForms.length < 5) {
      setUrlForms([...urlForms, { longUrl: '', validity: '', shortCode: '' }])
    }
  }

  const removeUrlForm = (index) => {
    if (urlForms.length > 1) {
      const newForms = urlForms.filter((_, i) => i !== index)
      setUrlForms(newForms)
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    const newErrors = []
    const newUrls = []

    urlForms.forEach((form, index) => {
      // Validate URL
      if (!form.longUrl) {
        newErrors.push({ index, field: 'longUrl', message: 'URL is required' })
        return
      }
      
      if (!validateUrl(form.longUrl)) {
        newErrors.push({ index, field: 'longUrl', message: 'Invalid URL format' })
        return
      }

      // Validate validity period if provided
      if (form.validity && (isNaN(form.validity) || parseInt(form.validity) <= 0)) {
        newErrors.push({ index, field: 'validity', message: 'Validity must be a positive number' })
        return
      }

      // Validate shortcode if provided
      if (form.shortCode) {
        const shortCodeRegex = /^[a-zA-Z0-9_-]{4,}$/
        if (!shortCodeRegex.test(form.shortCode)) {
          newErrors.push({ index, field: 'shortCode', message: 'Shortcode must be at least 4 characters and alphanumeric' })
          return
        }

        // Check if shortcode is unique
        if (urls.some(url => url.shortCode === form.shortCode)) {
          newErrors.push({ index, field: 'shortCode', message: 'Shortcode already exists' })
          return
        }
      }

      // Create URL object
      const shortCode = form.shortCode || generateShortCode()
      const validityMinutes = parseInt(form.validity) || 30
      const createdAt = new Date()
      const expiresAt = new Date(createdAt.getTime() + validityMinutes * 60000)

      newUrls.push({
        longUrl: form.longUrl,
        shortCode,
        createdAt: createdAt.toISOString(),
        expiresAt: expiresAt.toISOString(),
        clicks: 0,
        clickData: []
      })
    })

    if (newErrors.length > 0) {
      setErrors(newErrors)
      LoggingMiddleware.error('Form validation failed', { errors: newErrors })
      return
    }

    // Add new URLs to the list
    const updatedUrls = [...urls, ...newUrls]
    setUrls(updatedUrls)
    setErrors([])
    setSuccess(`${newUrls.length} URL(s) shortened successfully!`)
    
    // Reset forms
    setUrlForms([{ longUrl: '', validity: '', shortCode: '' }])
    
    LoggingMiddleware.info('URLs shortened successfully', { count: newUrls.length })
    
    // Clear success message after 3 seconds
    setTimeout(() => setSuccess(''), 3000)
  }

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text)
    LoggingMiddleware.info('URL copied to clipboard', { text })
  }

  return (
    <Container maxWidth="md" className="container">
      <Paper elevation={3} sx={{ p: 4, mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          URL Shortener
        </Typography>
        <Typography variant="body1" color="textSecondary" gutterBottom>
          Shorten up to 5 URLs at once. All fields are optional except for the URL.
        </Typography>

        {success && (
          <Alert severity="success" sx={{ mb: 2 }}>
            {success}
          </Alert>
        )}

        <form onSubmit={handleSubmit}>
          {urlForms.map((form, index) => (
            <Paper key={index} elevation={1} sx={{ p: 2, mb: 2, position: 'relative' }}>
              {urlForms.length > 1 && (
                <IconButton
                  sx={{ position: 'absolute', top: 8, right: 8 }}
                  onClick={() => removeUrlForm(index)}
                  color="error"
                >
                  <RemoveIcon />
                </IconButton>
              )}

              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Long URL"
                    value={form.longUrl}
                    onChange={(e) => handleInputChange(index, 'longUrl', e.target.value)}
                    error={errors.some(e => e.index === index && e.field === 'longUrl')}
                    helperText={errors.find(e => e.index === index && e.field === 'longUrl')?.message}
                    required
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Validity (minutes)"
                    type="number"
                    value={form.validity}
                    onChange={(e) => handleInputChange(index, 'validity', e.target.value)}
                    error={errors.some(e => e.index === index && e.field === 'validity')}
                    helperText={errors.find(e => e.index === index && e.field === 'validity')?.message}
                    placeholder="30 (default)"
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Preferred Shortcode"
                    value={form.shortCode}
                    onChange={(e) => handleInputChange(index, 'shortCode', e.target.value)}
                    error={errors.some(e => e.index === index && e.field === 'shortCode')}
                    helperText={errors.find(e => e.index === index && e.field === 'shortCode')?.message}
                  />
                </Grid>
              </Grid>
            </Paper>
          ))}

          <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 2 }}>
            <Button
              variant="outlined"
              onClick={addUrlForm}
              disabled={urlForms.length >= 5}
              startIcon={<AddIcon />}
            >
              Add Another URL
            </Button>
            <Button
              type="submit"
              variant="contained"
              size="large"
            >
              Shorten URLs
            </Button>
          </Box>
        </form>
      </Paper>

      {urls.length > 0 && (
        <Paper elevation={3} sx={{ p: 4 }}>
          <Typography variant="h5" component="h2" gutterBottom>
            Your Shortened URLs
          </Typography>
          {urls.map((url, index) => (
            <Card key={index} className="url-card" sx={{ mb: 2 }}>
              <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <Box>
                    <Typography variant="h6">
                      {window.location.origin}/{url.shortCode}
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                      Original: {url.longUrl}
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                      Expires: {new Date(url.expiresAt).toLocaleString()}
                    </Typography>
                    <Chip 
                      label={`${url.clicks} clicks`} 
                      size="small" 
                      sx={{ mt: 1 }} 
                    />
                  </Box>
                  <IconButton onClick={() => copyToClipboard(`${window.location.origin}/${url.shortCode}`)}>
                    <ContentCopyIcon />
                  </IconButton>
                </Box>
              </CardContent>
            </Card>
          ))}
        </Paper>
      )}
    </Container>
  )
}

export default UrlShortener