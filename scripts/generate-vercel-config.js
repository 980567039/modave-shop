const fs = require('fs');
const path = require('path');

const envFilePath = path.join(__dirname, '../.env.production');
const vercelConfigPath = path.join(__dirname, '../vercel.json');

try {
    // Read .env.local file
    const envContent = fs.readFileSync(envFilePath, 'utf8');
    const envLines = envContent.split('\n');

    const envVars = {};

    envLines.forEach(line => {
        const trimmedLine = line.trim();
        // Ignore comments and empty lines
        if (trimmedLine && !trimmedLine.startsWith('#')) {
            const [key, ...valueParts] = trimmedLine.split('=');
            if (key && valueParts.length > 0) {
                let value = valueParts.join('=').trim();
                // Remove inline comments (e.g. value # comment)
                const commentIndex = value.indexOf(' #');
                if (commentIndex !== -1) {
                    value = value.substring(0, commentIndex).trim();
                }
                envVars[key.trim()] = value;
            }
        }
    });

    // Read existing vercel.json if it exists to preserve other configs
    let vercelConfig = {};
    if (fs.existsSync(vercelConfigPath)) {
        try {
            const existingConfig = fs.readFileSync(vercelConfigPath, 'utf8');
            vercelConfig = JSON.parse(existingConfig);
        } catch (e) {
            console.warn('Could not parse existing vercel.json, starting fresh.');
        }
    }

    // Update or set the env property
    vercelConfig.env = {
        ...vercelConfig.env,
        ...envVars,
        "SITE_ENV": "production",
        "NODE_ENV": "production"
    };

    // Write back to vercel.json
    fs.writeFileSync(vercelConfigPath, JSON.stringify(vercelConfig, null, 2));

    console.log('Successfully generated vercel.json from .env.local');
    console.log(`Added ${Object.keys(envVars).length} environment variables.`);

} catch (error) {
    console.error('Error generating vercel.json:', error);
}
