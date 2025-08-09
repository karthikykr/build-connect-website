import '@testing-library/jest-dom'

// Mock Next.js router
jest.mock('next/navigation', () => ({
  useRouter() {
    return {
      push: jest.fn(),
      replace: jest.fn(),
      prefetch: jest.fn(),
      back: jest.fn(),
      forward: jest.fn(),
      refresh: jest.fn(),
    }
  },
  useSearchParams() {
    return new URLSearchParams()
  },
  usePathname() {
    return '/'
  },
}))

// Mock Next.js image component
jest.mock('next/image', () => ({
  __esModule: true,
  default: (props) => {
    // eslint-disable-next-line @next/next/no-img-element
    return <img {...props} />
  },
}))

// Mock Next.js link component
jest.mock('next/link', () => ({
  __esModule: true,
  default: ({ children, href, ...props }) => {
    return (
      <a href={href} {...props}>
        {children}
      </a>
    )
  },
}))

// Mock Framer Motion
jest.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }) => <div {...props}>{children}</div>,
    span: ({ children, ...props }) => <span {...props}>{children}</span>,
    button: ({ children, ...props }) => <button {...props}>{children}</button>,
    form: ({ children, ...props }) => <form {...props}>{children}</form>,
    input: ({ children, ...props }) => <input {...props}>{children}</input>,
    textarea: ({ children, ...props }) => <textarea {...props}>{children}</textarea>,
    select: ({ children, ...props }) => <select {...props}>{children}</select>,
    img: ({ children, ...props }) => <img {...props} alt={props.alt || ''} />,
    a: ({ children, ...props }) => <a {...props}>{children}</a>,
    nav: ({ children, ...props }) => <nav {...props}>{children}</nav>,
    header: ({ children, ...props }) => <header {...props}>{children}</header>,
    main: ({ children, ...props }) => <main {...props}>{children}</main>,
    section: ({ children, ...props }) => <section {...props}>{children}</section>,
    article: ({ children, ...props }) => <article {...props}>{children}</article>,
    aside: ({ children, ...props }) => <aside {...props}>{children}</aside>,
    footer: ({ children, ...props }) => <footer {...props}>{children}</footer>,
  },
  AnimatePresence: ({ children }) => children,
  useAnimation: () => ({
    start: jest.fn(),
    stop: jest.fn(),
    set: jest.fn(),
  }),
  useInView: () => true,
}))

// Mock Lucide React icons
jest.mock('lucide-react', () => {
  const icons = [
    'Home', 'User', 'Settings', 'Search', 'Menu', 'X', 'ChevronDown', 'ChevronUp',
    'ChevronLeft', 'ChevronRight', 'Plus', 'Minus', 'Edit', 'Trash', 'Save',
    'Cancel', 'Check', 'AlertCircle', 'Info', 'Warning', 'Error', 'Success',
    'Star', 'Heart', 'Share', 'Download', 'Upload', 'Mail', 'Phone', 'MapPin',
    'Calendar', 'Clock', 'Eye', 'EyeOff', 'Lock', 'Unlock', 'Shield', 'Key',
    'Building', 'Users', 'UserPlus', 'UserMinus', 'UserCheck', 'UserX',
    'MessageCircle', 'MessageSquare', 'Bell', 'BellOff', 'Notification',
    'Filter', 'Sort', 'Grid', 'List', 'Card', 'Table', 'Chart', 'Graph',
    'TrendingUp', 'TrendingDown', 'BarChart', 'PieChart', 'LineChart',
    'DollarSign', 'CreditCard', 'Wallet', 'Receipt', 'ShoppingCart',
    'Package', 'Truck', 'Plane', 'Car', 'Bike', 'Walk', 'Navigation',
    'Compass', 'Map', 'Globe', 'Wifi', 'WifiOff', 'Signal', 'Battery',
    'Power', 'Zap', 'Sun', 'Moon', 'Cloud', 'CloudRain', 'CloudSnow',
    'Thermometer', 'Droplets', 'Wind', 'Umbrella', 'Camera', 'Video',
    'Image', 'File', 'FileText', 'Folder', 'FolderOpen', 'Archive',
    'Bookmark', 'Tag', 'Flag', 'Award', 'Trophy', 'Medal', 'Gift',
    'Wrench', 'Hammer', 'Screwdriver', 'Paintbrush', 'Scissors', 'Ruler',
    'Calculator', 'Clipboard', 'Copy', 'Cut', 'Paste', 'Undo', 'Redo',
    'Refresh', 'RotateCcw', 'RotateCw', 'Maximize', 'Minimize', 'Move',
    'Resize', 'ZoomIn', 'ZoomOut', 'Focus', 'Unfocus', 'Target', 'Crosshair',
    'Layers', 'Layout', 'Sidebar', 'PanelLeft', 'PanelRight', 'PanelTop',
    'PanelBottom', 'Columns', 'Rows', 'Square', 'Circle', 'Triangle',
    'Hexagon', 'Pentagon', 'Octagon', 'Diamond', 'Oval', 'Rectangle',
    'RoundedRectangle', 'Parallelogram', 'Trapezoid', 'Rhombus', 'Kite',
    'ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowUpLeft',
    'ArrowUpRight', 'ArrowDownLeft', 'ArrowDownRight', 'CornerUpLeft',
    'CornerUpRight', 'CornerDownLeft', 'CornerDownRight', 'Move3d',
    'RotateCcw', 'RotateCw', 'Repeat', 'Shuffle', 'SkipBack', 'SkipForward',
    'Rewind', 'FastForward', 'Play', 'Pause', 'Stop', 'Record', 'Mic',
    'MicOff', 'Volume', 'Volume1', 'Volume2', 'VolumeX', 'Speaker',
    'Headphones', 'Radio', 'Tv', 'Monitor', 'Smartphone', 'Tablet',
    'Laptop', 'Desktop', 'Server', 'Database', 'HardDrive', 'Cpu',
    'MemoryStick', 'Usb', 'Bluetooth', 'Printer', 'Scanner', 'Keyboard',
    'Mouse', 'Gamepad', 'Joystick', 'Controller', 'Headset', 'Webcam'
  ]
  
  const mockIcons = {}
  icons.forEach(icon => {
    mockIcons[icon] = ({ className, size, ...props }) => (
      <svg
        className={className}
        width={size || 24}
        height={size || 24}
        data-testid={`${icon.toLowerCase()}-icon`}
        {...props}
      >
        <title>{icon}</title>
      </svg>
    )
  })
  
  return mockIcons
})

// Mock React Hot Toast
jest.mock('react-hot-toast', () => ({
  toast: {
    success: jest.fn(),
    error: jest.fn(),
    loading: jest.fn(),
    dismiss: jest.fn(),
    promise: jest.fn(),
  },
  Toaster: () => null,
}))

// Mock Zustand stores
jest.mock('@/stores/authStore', () => ({
  useAuthStore: () => ({
    user: null,
    isAuthenticated: false,
    login: jest.fn(),
    logout: jest.fn(),
    updateUser: jest.fn(),
  }),
}))

// Mock environment variables
process.env.NEXTAUTH_URL = 'http://localhost:3000'
process.env.NEXTAUTH_SECRET = 'test-secret'
process.env.GOOGLE_CLIENT_ID = 'test-google-client-id'
process.env.GOOGLE_CLIENT_SECRET = 'test-google-client-secret'

// Global test utilities
global.ResizeObserver = jest.fn().mockImplementation(() => ({
  observe: jest.fn(),
  unobserve: jest.fn(),
  disconnect: jest.fn(),
}))

global.IntersectionObserver = jest.fn().mockImplementation(() => ({
  observe: jest.fn(),
  unobserve: jest.fn(),
  disconnect: jest.fn(),
}))

// Mock window.matchMedia
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: jest.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(), // deprecated
    removeListener: jest.fn(), // deprecated
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  })),
})

// Mock window.scrollTo
Object.defineProperty(window, 'scrollTo', {
  writable: true,
  value: jest.fn(),
})

// Mock localStorage
const localStorageMock = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
}
Object.defineProperty(window, 'localStorage', {
  value: localStorageMock,
})

// Mock sessionStorage
const sessionStorageMock = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
}
Object.defineProperty(window, 'sessionStorage', {
  value: sessionStorageMock,
})

// Suppress console warnings in tests
const originalError = console.error
beforeAll(() => {
  console.error = (...args) => {
    if (
      typeof args[0] === 'string' &&
      args[0].includes('Warning: ReactDOM.render is no longer supported')
    ) {
      return
    }
    originalError.call(console, ...args)
  }
})

afterAll(() => {
  console.error = originalError
})
