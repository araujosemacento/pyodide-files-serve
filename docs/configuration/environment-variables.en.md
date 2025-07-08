# 🔧 Environment Variables Configuration

## 📋 Overview

This project uses environment variables for secure configuration of external APIs, especially for the analytics system.

## 🗂️ Configuration Files

This project uses **dotenvx** for secure encryption of environment variables, allowing sensitive data to be stored safely in the repository.

### `.env` (Local Development)

File for local development configuration (not committed to Git).

```dotenv
# Analytics - Pantry Cloud Configuration
PUBLIC_PANTRY_ID=your_pantry_id_here
```

### `.env.ci` (Encrypted Production)

Committed file with encrypted variables for production. Uses dotenvx for secure encryption.

```dotenv
#/-------------------[DOTENV_PUBLIC_KEY]--------------------/
#/            public-key encryption for .env files          /
#/       [how it works](https://dotenvx.com/encryption)     /
#/----------------------------------------------------------/
DOTENV_PUBLIC_KEY_CI="dotenvx_public_key"

# .env.ci
PUBLIC_PANTRY_ID='encrypted:encrypted_value_here'
```

### `.env.keys` (Decryption Keys)

File with private keys to decrypt `.env.ci` (NOT committed to Git).

```dotenv
#/------------------!DOTENV_PRIVATE_KEYS!-------------------/
#/ private decryption keys. DO NOT commit to source control /
#/     [how it works](https://dotenvx.com/encryption)       /
#/----------------------------------------------------------/

# .env.ci
DOTENV_PRIVATE_KEY_CI=private_decryption_key
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

### GitHub Pages with Dotenvx (Recommended)

The project uses **dotenvx** for secure variable encryption, allowing safe storage of sensitive data in the repository:

#### 1. Local Encryption

```bash
# Encrypt variable for production
npx dotenvx encrypt -f .env.ci
```

#### 2. GitHub Secrets Configuration

- **`DOTENV_PRIVATE_KEY_CI`**: Private key to decrypt `.env.ci`
- Obtained from `.env.keys` file (not committed)

#### 3. File Structure

- **`.env.ci`**: Encrypted variables (committed)
- **`.env.keys`**: Private keys (NOT committed)
- **`.env`**: Local development (NOT committed)

#### ⚠️ Environment Importance

- **`.env`**: Local development without encryption
- **`.env.ci`**: Production with encrypted values via dotenvx
- **Separation required**: Avoids conflicts between development and production
- **Security**: Sensitive data is encrypted in the public repository

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
- ✅ Use dotenvx encryption for variables in public repositories
- ✅ Keep `.env` for development and `.env.ci` for production
- ✅ Never commit `.env.keys` to the repository

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
- [Dotenvx Encryption Guide](https://dotenvx.com/docs/quickstart#add-encryption)
- [Pantry Cloud API](https://getpantry.cloud/)
