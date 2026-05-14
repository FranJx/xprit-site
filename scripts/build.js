#!/usr/bin/env node

const fs = require('fs')
const path = require('path')
const { execSync } = require('child_process')

console.log('🚀 Building XpriT Robotics with XTH...\n')

// Helper function to recursively copy files
function copyRecursive(src, dest) {
  if (!fs.existsSync(dest)) {
    fs.mkdirSync(dest, { recursive: true })
  }

  const entries = fs.readdirSync(src, { withFileTypes: true })

  entries.forEach(entry => {
    const srcPath = path.join(src, entry.name)
    const destPath = path.join(dest, entry.name)

    if (entry.isDirectory()) {
      copyRecursive(srcPath, destPath)
    } else {
      fs.copyFileSync(srcPath, destPath)
    }
  })
}

// 1. Build Next.js
console.log('📦 Building Next.js...')
try {
  execSync('next build', { stdio: 'inherit' })
  console.log('✅ Next.js built successfully\n')
} catch (err) {
  console.error('❌ Next.js build failed:', err.message)
  process.exit(1)
}

// 2. Build XTH Frontend
const xthFrontendPath = path.join(process.cwd(), 'xprit-robotics-hub', 'frontend')

if (!fs.existsSync(xthFrontendPath)) {
  console.error(`❌ XTH Frontend not found at ${xthFrontendPath}`)
  process.exit(1)
}

console.log(`📦 Building XTH Frontend from ${xthFrontendPath}...`)

try {
  // Install dependencies
  console.log('📦 Installing XTH dependencies...')
  execSync('npm install', {
    cwd: xthFrontendPath,
    stdio: 'inherit',
  })

  // Build
  console.log('🔨 Compiling XTH...')
  execSync('npm run build', {
    cwd: xthFrontendPath,
    stdio: 'inherit',
  })

  console.log('✅ XTH built successfully\n')
} catch (err) {
  console.error('❌ XTH build failed:', err.message)
  process.exit(1)
}

// 3. Copy XTH dist to public/hub
const distPath = path.join(xthFrontendPath, 'dist')
const publicHubPath = path.join(process.cwd(), 'public', 'hub')

console.log(`📁 Copying XTH files...`)
console.log(`   From: ${distPath}`)
console.log(`   To:   ${publicHubPath}`)

try {
  if (!fs.existsSync(distPath)) {
    console.error(`❌ XTH dist directory not found at ${distPath}`)
    process.exit(1)
  }

  // Remove existing public/hub if it exists
  if (fs.existsSync(publicHubPath)) {
    console.log(`🗑️  Removing existing ${publicHubPath}...`)
    fs.rmSync(publicHubPath, { recursive: true, force: true })
  }

  // Create fresh public/hub directory
  fs.mkdirSync(publicHubPath, { recursive: true })
  console.log(`✅ Created directory: ${publicHubPath}`)

  // Copy all files
  copyRecursive(distPath, publicHubPath)

  // Verify files were copied
  const files = fs.readdirSync(publicHubPath)
  console.log(`✅ XTH files copied successfully (${files.length} items)`)
  console.log(`   Files: ${files.slice(0, 5).join(', ')}${files.length > 5 ? '...' : ''}`)
} catch (err) {
  console.error(`❌ Error copying XTH files:`, err.message)
  process.exit(1)
}

console.log('\n✅ Build completed successfully!')
console.log(`📍 XTH is available at /public/hub`)
console.log(`🌐 Access at: /hub`)

