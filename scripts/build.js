#!/usr/bin/env node

const fs = require('fs')
const path = require('path')
const { execSync } = require('child_process')

console.log('🚀 Building XpriT Robotics with XTH...\n')

// 1. Build Next.js
console.log('📦 Building Next.js...')
try {
  execSync('next build', { stdio: 'inherit' })
  console.log('✅ Next.js built successfully\n')
} catch (err) {
  console.error('❌ Next.js build failed')
  process.exit(1)
}

// 2. Build XTH Frontend
const xthFrontendPath = path.join(process.cwd(), 'xprit-robotics-hub/frontend')
console.log(`📦 Building XTH Frontend from ${xthFrontendPath}...`)

try {
  // Install dependencies
  console.log('📦 Installing XTH dependencies...')
  execSync('npm install', { 
    cwd: xthFrontendPath,
    stdio: 'inherit'
  })
  
  // Build
  console.log('🔨 Compiling XTH...')
  execSync('npm run build', { 
    cwd: xthFrontendPath,
    stdio: 'inherit'
  })
  
  console.log('✅ XTH built successfully\n')
} catch (err) {
  console.error('❌ XTH build failed')
  process.exit(1)
}

// 3. Copy XTH dist to public/hub
const distPath = path.join(xthFrontendPath, 'dist')
const hubPublicPath = path.join(process.cwd(), 'public/hub')

console.log(`📁 Copying XTH from ${distPath} to ${hubPublicPath}...`)

try {
  // Create public/hub if it doesn't exist
  if (!fs.existsSync(hubPublicPath)) {
    fs.mkdirSync(hubPublicPath, { recursive: true })
    console.log(`✅ Created directory: ${hubPublicPath}`)
  }
  
  // Copy files
  if (fs.existsSync(distPath)) {
    const copyRecursive = (src, dest) => {
      const entries = fs.readdirSync(src, { withFileTypes: true })
      
      entries.forEach(entry => {
        const srcPath = path.join(src, entry.name)
        const destPath = path.join(dest, entry.name)
        
        if (entry.isDirectory()) {
          if (!fs.existsSync(destPath)) {
            fs.mkdirSync(destPath, { recursive: true })
          }
          copyRecursive(srcPath, destPath)
        } else {
          fs.copyFileSync(srcPath, destPath)
        }
      })
    }
    
    copyRecursive(distPath, hubPublicPath)
    console.log(`✅ XTH files copied successfully\n`)
  } else {
    console.error(`❌ XTH dist directory not found at ${distPath}`)
    process.exit(1)
  }
} catch (err) {
  console.error(`❌ Error copying XTH files: ${err.message}`)
  process.exit(1)
}

console.log('✅ Build completed successfully!')
console.log(`📍 XTH is available at /public/hub`)
