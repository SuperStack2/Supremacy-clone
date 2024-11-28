import { render } from '@testing-library/react'
import App from '../src/components/App'

test('renders App component without crashing', () => {
  render(<App />)
})