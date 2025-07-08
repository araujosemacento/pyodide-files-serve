# 🔧 Environment Variables Configuration

## 📋 Overview

This project uses environment variables for secure configuration of external APIs, especially for the analytics system.

## 🗂️ Configuration Files

### `.env` (Local Development)

File for local development configuration (not committed to Git).

```dotenv
# Analytics - Pantry Cloud Configuration
PUBLIC_PANTRY_ID=your_pantry_id_here
```

### `.env.example` (Template)

Template with required variables (committed to Git as reference).

```dotenv
# Analytics - Pantry Cloud Configuration
# Get your Pantry ID at: https://getpantry.cloud/
PUBLIC_PANTRY_ID=your_pantry_id_here
```

## 🔑 Available Variables

### `PUBLIC_PANTRY_ID`

- **Type**: String
- **Required**: Yes
- **Description**: Unique Pantry ID for analytics storage
- **How to get**:
  1. Go to [getpantry.cloud](https://getpantry.cloud/)
  2. Create a new account or login
  3. Copy your unique Pantry ID
- **Example**: `a7e3dbbc5bd3c45e84e978543ceed45cdebbba39dc5ba439e8e3dc4be7b5`

## 🚀 Development Configuration

### 1. Create the `.env` file

```bash
# In the project root
cp .env.example .env
```

### 2. Configure the variables

```dotenv
PUBLIC_PANTRY_ID=your_real_pantry_id
```

### 3. Restart the development server

```bash
npm run dev
```

## 🌐 Production Configuration

### GitHub Pages (Recommended)

The project uses dotenvx for secure variable encryption:

1. **Encrypted variables** in the committed `.env` file
2. **Decryption key** configured in GitHub Secrets
3. **Automatic decryption** during build

### Manual Configuration

For other deployment platforms:

1. Configure the `PUBLIC_PANTRY_ID` variable in the platform panel
2. Ensure the variable is available during build
3. The project will automatically detect environment variables

## 🔒 Security

### Public vs Private Variables

- **`PUBLIC_*`**: Exposed to the client (use only for non-sensitive data)
- **No prefix**: Available only on the server

### Best Practices

- ✅ Never commit `.env` files with real data
- ✅ Use `.env.example` as template
- ✅ Configure Secrets in GitHub for sensitive variables
- ✅ Use encryption for variables in public repositories

## 🛠️ Troubleshooting

### Variable not loaded

```javascript
// Check if the variable is being loaded
console.log(env.PUBLIC_PANTRY_ID); // undefined = not configured
```

### Analytics Error

If analytics doesn't work:

1. Check if `PUBLIC_PANTRY_ID` is configured
2. Test the Pantry ID at [getpantry.cloud](https://getpantry.cloud/)
3. Check console logs (development mode)

### Build failing

- Ensure all required variables are configured
- For GitHub Actions, configure the necessary Secrets

## 📚 References

- [SvelteKit Environment Variables](https://kit.svelte.dev/docs/modules#$env-dynamic-public)
- [Dotenvx Documentation](https://dotenvx.com/)
- [Pantry Cloud API](https://getpantry.cloud/)
