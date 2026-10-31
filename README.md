# Email notification service

Mailer microservice berbasis Express, Nodemailer, dan in-memory queue.

## Run

Copy `src/.env.example` ke environment aplikasi, lalu isi konfigurasi SMTP/mailtrap.

```bash
npm run dev
```

## API

`POST /notifications`

```json
{
  "to": "recipient@example.com",
  "subject": "Welcome",
  "text": "Welcome to the service"
}
```

Request diterima dengan status `202` setelah masuk queue. Queue saat ini hanya in-memory, sehingga item yang belum terkirim hilang ketika proses berhenti.

```bash
npm run build
npm start
```

## Docker

```bash
docker build -t notification-service .
docker run --rm -p 3000:3000 \
  -e SMTP_HOST=smtp.example.com \
  -e SMTP_PORT=587 \
  -e SMTP_SECURE=false \
  -e MAIL_FROM=no-reply@example.com \
  notification-service
```

Image sudah menyertakan `HEALTHCHECK` ke `/health`. Level log dapat diatur lewat `LOG_LEVEL` (default `info`).


--- 
# Kube
- namespace: notif
- akses UI mailtrap
```
kubectl port-forward service/mailtrap 8025:8025
```
- test endpoint via curl (POST)
```
curl -i -X POST \
  --resolve notification.test.com:80:127.0.0.1 \
  http://notification.test.com/notifications \
  -H 'Content-Type: application/json' \
  -d '{
    "to": "test@example.com",
    "subject": "Test notification",
    "text": "Tes notif"
  }'
```
