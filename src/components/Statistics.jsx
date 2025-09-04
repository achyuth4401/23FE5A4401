import React from 'react'
import {
  Container,
  Paper,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Box
} from '@mui/material'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import LoggingMiddleware from './loggingmiddleware'

const Statistics = ({ urls }) => {
  React.useEffect(() => {
    LoggingMiddleware.info('Statistics page viewed', { urlCount: urls.length })
  }, [urls])

  const isUrlExpired = (expiresAt) => {
    return new Date(expiresAt) < new Date()
  }

  const getLocationFromIP = async (ip) => {
    // In a real application, you would call a geolocation API
    // This is a mock implementation
    return 'Hyderabad, India'
  }

  return (
    <Container maxWidth="lg" className="container">
      <Paper elevation={3} sx={{ p: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          URL Statistics
        </Typography>
        
        {urls.length === 0 ? (
          <Typography variant="body1" color="textSecondary" align="center" sx={{ py: 4 }}>
            No URLs have been shortened yet.
          </Typography>
        ) : (
          <TableContainer className="stats-table">
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Short URL</TableCell>
                  <TableCell>Original URL</TableCell>
                  <TableCell>Created</TableCell>
                  <TableCell>Expires</TableCell>
                  <TableCell>Clicks</TableCell>
                  <TableCell>Status</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {urls.map((url, index) => (
                  <TableRow key={index}>
                    <TableCell>
                      <Typography variant="body2">
                        {window.location.origin}/{url.shortCode}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography 
                        variant="body2" 
                        sx={{ 
                          maxWidth: '200px', 
                          overflow: 'hidden', 
                          textOverflow: 'ellipsis', 
                          whiteSpace: 'nowrap' 
                        }}
                      >
                        {url.longUrl}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      {new Date(url.createdAt).toLocaleString()}
                    </TableCell>
                    <TableCell>
                      {new Date(url.expiresAt).toLocaleString()}
                    </TableCell>
                    <TableCell>
                      <Chip 
                        label={url.clicks} 
                        color={url.clicks > 0 ? 'primary' : 'default'}
                      />
                    </TableCell>
                    <TableCell>
                      <Chip 
                        label={isUrlExpired(url.expiresAt) ? 'Expired' : 'Active'} 
                        color={isUrlExpired(url.expiresAt) ? 'error' : 'success'}
                        variant="outlined"
                      />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}

        {urls.some(url => url.clickData.length > 0) && (
          <Box sx={{ mt: 4 }}>
            <Typography variant="h5" component="h2" gutterBottom>
              Click Details
            </Typography>
            {urls.map((url, index) => (
              url.clickData.length > 0 && (
                <Accordion key={index} sx={{ mt: 2 }}>
                  <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                    <Typography>
                      {window.location.origin}/{url.shortCode} - {url.clickData.length} clicks
                    </Typography>
                  </AccordionSummary>
                  <AccordionDetails>
                    <TableContainer>
                      <Table size="small">
                        <TableHead>
                          <TableRow>
                            <TableCell>Timestamp</TableCell>
                            <TableCell>Source</TableCell>
                            <TableCell>Location</TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {url.clickData.map((click, clickIndex) => (
                            <TableRow key={clickIndex}>
                              <TableCell>
                                {new Date(click.timestamp).toLocaleString()}
                              </TableCell>
                              <TableCell>
                                {click.source}
                              </TableCell>
                              <TableCell>
                                {click.location}
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </TableContainer>
                  </AccordionDetails>
                </Accordion>
              )
            ))}
          </Box>
        )}
      </Paper>
    </Container>
  )
}

export default Statistics