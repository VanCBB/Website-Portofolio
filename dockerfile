# Menggunakan image nginx paling ringan
FROM nginx:alpine

# Hapus konfigurasi default Nginx
RUN rm /etc/nginx/conf.d/default.conf

# Salin konfigurasi Nginx kamu sendiri
COPY default.conf /etc/nginx/conf.d/default.conf

# Salin semua file HTML, CSS, JS, dan assets ke folder Nginx
COPY . /usr/share/nginx/html

# Buka port 80
EXPOSE 80

# Jalankan Nginx di foreground
CMD ["nginx", "-g", "daemon off;"]
