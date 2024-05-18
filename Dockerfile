# Menggunakan image Node.js versi 20
FROM node:20-alpine

# Menetapkan direktori kerja di dalam container
WORKDIR /app

# Menyalin package.json dan package-lock.json
COPY package*.json ./

# Menginstal dependensi
RUN npm install

# Menyalin semua file ke container
COPY . .

# Membuild proyek TypeScript
RUN npm run build

# Memulai aplikasi
CMD ["npm", "start"]
