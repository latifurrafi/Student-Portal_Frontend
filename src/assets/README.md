# Assets Directory

This directory contains static assets for the Student Portal application.

## Files

- `DIU-Logo.png` - Daffodil International University logo used in the sidebar

## Usage

Import assets in your React components:

```javascript
import diuLogo from '../assets/DIU-Logo.png';
```

Then use them in your JSX:

```jsx
<img src={diuLogo} alt="DIU Logo" className="w-10 h-10 object-contain" />
``` 