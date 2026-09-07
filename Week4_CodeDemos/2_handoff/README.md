# Handoff

A phone browser acts as a remote controller; a laptop browser runs the p5.js
platformer environment. Both talk through a small Node.js + socket.io relay.

```
[Phone browser]  --touch/tap-->  [Node.js server]  --broadcast-->  [Laptop browser]
   phone.html                       server.js                      laptop.html
```

## Requirements

- Node.js 18 or later installed on the laptop
- `openssl` available on the laptop (macOS and Linux have this by default)
- Laptop and phone connected to the **same Wi-Fi network**
- Any modern phone browser (Safari on iOS, Chrome on Android)

## 1. Install

Unzip the project, then in a terminal:

```bash
cd 2_handoff
npm install
```

A `key.pem` and `cert.pem` are already included in the project root. If you
ever need to regenerate them (e.g. they expire after 365 days):

```bash
openssl req -x509 -newkey rsa:2048 -keyout key.pem -out cert.pem -days 365 -nodes -subj "/CN=localhost"
```

## 2. Run the server

```bash
npm start
```

You'll see something like:

```
Play environment handoff server running (HTTPS)
-------------------------------------------------
Laptop (environment):
  https://localhost:3000/laptop.html

Phone (remote) — on the same Wi-Fi as this laptop:
  https://192.168.1.14:3000/phone.html

The phone will show a certificate warning on first visit
(self-signed cert) — tap "Show Details" then "visit this
website" to proceed. This only needs to happen once.
-------------------------------------------------
```

## 3. Open the two pages

1. On the **laptop**, open the `https://localhost:3000/laptop.html` link.
   Your browser will also warn about the self-signed cert — proceed past it.
   You should see a dark canvas with a red square, a floor, and a floating
   platform.
2. On the **phone**, open the `https://<laptop's IP>:3000/phone.html` link
   (the second link printed in the terminal. Tap through the certificate warning the
   same way as on the laptop.
3. Tap **"tap to start remote"** on the phone. This requests both motion and
   orientation permission in the same gesture.
4. Drag your finger on the phone screen to move the square left and right on
   the laptop. Tap near the edge of the circular pad to jump.